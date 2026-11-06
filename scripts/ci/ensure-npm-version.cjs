'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

const REQUIRED_NPM_VERSION = '11.5.1';

function parseSemver(input) {
  if (typeof input !== 'string') throw new TypeError('Version must be a string');
  const value = input.trim();
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(value);
  if (!match) throw new Error('Invalid semantic version: ' + JSON.stringify(input));

  const prerelease = match[4] ? match[4].split('.') : [];
  for (const identifier of prerelease) {
    if (/^\d+$/.test(identifier) && identifier.length > 1 && identifier.startsWith('0')) {
      throw new Error('Invalid numeric prerelease identifier in version: ' + value);
    }
  }

  return {
    major: BigInt(match[1]),
    minor: BigInt(match[2]),
    patch: BigInt(match[3]),
    prerelease,
  };
}

function compareSemver(leftInput, rightInput) {
  const left = parseSemver(leftInput);
  const right = parseSemver(rightInput);

  for (const key of ['major', 'minor', 'patch']) {
    if (left[key] > right[key]) return 1;
    if (left[key] < right[key]) return -1;
  }

  if (left.prerelease.length === 0 && right.prerelease.length === 0) return 0;
  if (left.prerelease.length === 0) return 1;
  if (right.prerelease.length === 0) return -1;

  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const a = left.prerelease[index];
    const b = right.prerelease[index];
    if (a === undefined) return -1;
    if (b === undefined) return 1;
    if (a === b) continue;

    const aNumeric = /^\d+$/.test(a);
    const bNumeric = /^\d+$/.test(b);
    if (aNumeric && bNumeric) return BigInt(a) > BigInt(b) ? 1 : -1;
    if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
    return a > b ? 1 : -1;
  }
  return 0;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error('Command failed: ' + command + ' ' + args.join(' ') +
      (result.stderr ? '\n' + result.stderr.trim() : ''));
  }
  return result.stdout.trim();
}

function writeGitHubOutput(values) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  const content = Object.entries(values).map(([key, value]) => key + '=' + value).join('\n') + '\n';
  fs.appendFileSync(outputPath, content, { encoding: 'utf8', mode: 0o600 });
}

function ensureNpmVersion() {
  let current = run('npm', ['--version']);
  let upgraded = false;

  if (compareSemver(current, REQUIRED_NPM_VERSION) < 0) {
    console.log('npm ' + current + ' is below ' + REQUIRED_NPM_VERSION + '; installing the pinned compatible npm release.');
    const install = spawnSync('npm', ['install', '--global', 'npm@' + REQUIRED_NPM_VERSION], {
      stdio: 'inherit',
      env: process.env,
    });
    if (install.error) throw install.error;
    if (install.status !== 0) throw new Error('Installing the required npm version failed.');
    upgraded = true;
    current = run('npm', ['--version']);
  }

  if (compareSemver(current, REQUIRED_NPM_VERSION) < 0) {
    throw new Error('npm ' + current + ' is still below the required ' + REQUIRED_NPM_VERSION + ' after upgrade.');
  }

  writeGitHubOutput({
    npm_version: current,
    npm_upgraded: String(upgraded),
    npm_minimum_version: REQUIRED_NPM_VERSION,
  });
  console.log('Validated npm ' + current + ' (minimum ' + REQUIRED_NPM_VERSION + '; upgraded: ' + upgraded + ').');
}

if (require.main === module) {
  try {
    ensureNpmVersion();
  } catch (error) {
    console.error('::error::' + error.message);
    process.exitCode = 1;
  }
}

module.exports = { REQUIRED_NPM_VERSION, compareSemver, parseSemver };

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { compareSemver, REQUIRED_NPM_VERSION } = require('../scripts/ci/ensure-npm-version.cjs');

test('npm versions below the Trusted Publishing minimum are rejected', () => {
  for (const version of ['10.9.9', '11.0.0', '11.21.1']) {
    assert.equal(compareSemver(version, REQUIRED_NPM_VERSION), -1, version);
  }
});

test('the minimum and newer npm versions are accepted', () => {
  for (const version of ['11.21.2', '11.22.0', '12.0.0']) {
    assert.ok(compareSemver(version, REQUIRED_NPM_VERSION) >= 0, version);
  }
});

test('semantic prerelease precedence is respected', () => {
  assert.equal(compareSemver('11.5.1-beta.1', '11.21.2'), -1);
  assert.equal(compareSemver('11.5.2-rc.1', '11.21.2'), 1);
  assert.equal(compareSemver('11.5.1+build.7', '11.21.2'), 0);
});

test('invalid versions fail closed', () => {
  for (const version of ['10.9', 'v11.5.1', '11.05.1', '11.5.1-', '']) {
    assert.throws(() => compareSemver(version, REQUIRED_NPM_VERSION));
  }
});

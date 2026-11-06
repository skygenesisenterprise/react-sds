#!/usr/bin/env node

/**
 * This script is ran with `npx react-sds copy-legacy-to-public`
 * It takes one optional arguments (for NX monorepos):
 * - `--projectDir <path>` to specify the project directory. Default to the current working directory.
 *   This can be used in monorepos to specify the react project directory.
 */

import { join as pathJoin, resolve as pathResolve } from "path";
import * as fs from "fs";
import { getProjectRoot } from "./tools/getProjectRoot";
import yargsParser from "yargs-parser";
import { getAbsoluteAndInOsFormatPath } from "./tools/getAbsoluteAndInOsFormatPath";
import { readPublicDirPath } from "./readPublicDirPath";
import { transformCodebase } from "./tools/transformCodebase";
import { assert } from "tsafe/assert";
import { modifyHtmlHrefs } from "./tools/modifyHtmlHrefs";

export async function main(args: string[]) {
    const argv = yargsParser(args);

    const projectDirPath: string = (() => {
        read_from_argv: {
            const arg = argv["projectDir"];

            if (arg === undefined) {
                break read_from_argv;
            }

            return getAbsoluteAndInOsFormatPath({ "pathIsh": arg, "cwd": process.cwd() });
        }

        return process.cwd();
    })();

    const publicDirPath = await readPublicDirPath({ projectDirPath });

    const htmlFilePath = await (async () => {
        vite: {
            const filePath = pathJoin(projectDirPath, "index.html");

            if (!fs.existsSync(filePath)) {
                break vite;
            }

            return filePath;
        }

        cra: {
            const filePath = pathJoin(publicDirPath, "index.html");

            if (!fs.existsSync(filePath)) {
                break cra;
            }

            return filePath;
        }

        assert(false, "Can't locate your index.html file.");
    })();

    if (!fs.existsSync(publicDirPath)) {
        console.error(`Can't locate your public directory.`);
        process.exit(-1);
    }

    const legacyDirPath = pathJoin(publicDirPath, "legacy");

    const gouvFrLegacyVersion: string = JSON.parse(
        fs.readFileSync(pathJoin(getProjectRoot(), "package.json")).toString("utf8")
    )["devDependencies"]["@gouvfr/dsfr"];

    const versionFilePath = pathJoin(legacyDirPath, "version.txt");

    early_exit: {
        if (!fs.existsSync(legacyDirPath)) {
            break early_exit;
        }

        if (!fs.existsSync(versionFilePath)) {
            break early_exit;
        }

        const currentVersion = fs.readFileSync(versionFilePath).toString("utf8");

        if (currentVersion !== gouvFrLegacyVersion) {
            fs.rmSync(legacyDirPath, { "recursive": true, "force": true });
            break early_exit;
        }

        return;
    }

    fs.mkdirSync(legacyDirPath, { "recursive": true });

    fs.writeFileSync(pathJoin(legacyDirPath, ".gitignore"), Buffer.from("*", "utf8"));

    const legacyDistNodeModulesDirPath = (function legacyDistNodeModulesDirPath(
        depth: number
    ): string {
        const parentProjectDirPath = pathResolve(
            pathJoin(...[projectDirPath, ...new Array(depth).fill("..")])
        );

        const legacyDirPathInNodeModules = pathJoin(
            ...[
                parentProjectDirPath,
                "node_modules",
                "@skygenesisenterprise",
                "react-sds",
                "dist",
                "legacy"
            ]
        );

        if (!fs.existsSync(legacyDirPathInNodeModules)) {
            if (parentProjectDirPath === "/") {
                console.error(
                    [
                        "Can't find legacy directory",
                        `please submit an issue about it here ${getRepoIssueUrl()}`
                    ].join(" ")
                );
                process.exit(-1);
            }

            return legacyDistNodeModulesDirPath(depth + 1);
        }

        return legacyDirPathInNodeModules;
    })(0);

    {
        const legacyMinCssFileRelativePath = "legacy.min.css";

        const usedAssetsRelativeFilePaths = new Set(
            readAssetsImportFromLegacyCss({
                "legacySourceCode": fs
                    .readFileSync(
                        pathJoin(legacyDistNodeModulesDirPath, legacyMinCssFileRelativePath)
                    )
                    .toString("utf8")
            })
        );

        const fileToKeepRelativePaths = new Set([
            pathJoin("favicon", "apple-touch-icon.png"),
            pathJoin("favicon", "favicon.svg"),
            pathJoin("favicon", "favicon.ico"),
            pathJoin("favicon", "manifest.webmanifest"),
            pathJoin("utility", "icons", "icons.min.css"),
            legacyMinCssFileRelativePath
        ]);

        transformCodebase({
            "srcDirPath": legacyDistNodeModulesDirPath,
            "destDirPath": legacyDirPath,
            "transformSourceCode": ({ fileRelativePath, sourceCode }) => {
                if (
                    fileToKeepRelativePaths.has(fileRelativePath) ||
                    usedAssetsRelativeFilePaths.has(fileRelativePath)
                ) {
                    return { "modifiedSourceCode": sourceCode };
                }
            }
        });
    }

    fs.writeFileSync(versionFilePath, Buffer.from(gouvFrLegacyVersion, "utf8"));

    add_version_query_params_in_html_imports: {
        const { modifiedHtml } = modifyHtmlHrefs({
            "html": fs.readFileSync(htmlFilePath).toString("utf8"),
            "getModifiedHref": href => {
                if (!href.includes("/legacy/")) {
                    return href;
                }

                const [urlWithoutQuery] = href.split("?");

                return `${urlWithoutQuery}?v=${gouvFrLegacyVersion}`;
            }
        });

        if (htmlFilePath === modifiedHtml) {
            break add_version_query_params_in_html_imports;
        }

        fs.writeFileSync(htmlFilePath, Buffer.from(modifiedHtml, "utf8"));
    }
}

function readAssetsImportFromLegacyCss(params: { legacySourceCode: string }): string[] {
    const { legacySourceCode } = params;

    const fileRelativePaths = [/url\("([^"]+)"\)/g, /url\('([^']+)'\)/g, /url\(([^)]+)\)/g]
        .map(regex => {
            const fileRelativePaths: string[] = [];

            legacySourceCode.replace(regex, (...[, relativeFilePath]) => {
                if (relativeFilePath.startsWith("data:")) {
                    return "";
                }

                fileRelativePaths.push(relativeFilePath);

                return "";
            });

            return fileRelativePaths;
        })
        .flat();

    assert(fileRelativePaths.length !== 0);

    return fileRelativePaths;
}

function getRepoIssueUrl() {
    const reactLegacyRepoUrl = JSON.parse(
        fs.readFileSync(pathJoin(getProjectRoot(), "package.json")).toString("utf8")
    )
        ["repository"]["url"].replace(/^git/, "https:")
        .replace(/\.git$/, "");

    return `${reactLegacyRepoUrl}/issues`;
}

if (require.main === module) {
    main(process.argv.slice(2));
}

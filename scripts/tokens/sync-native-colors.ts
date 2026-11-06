/**
 * Rewrites `src/native/tokens/colors.ts` from the institutional CSS tokens.
 *
 *     pnpm tokens:sync
 *
 * Run it after editing `src/styles/foundation/colors.css` or a theme. It is not
 * part of `pnpm build` on purpose: a build that rewrites a source file would
 * leave the working tree dirty in CI and make "did someone forget to
 * regenerate?" unanswerable. The coherence test is what enforces the sync.
 */

import * as fs from "fs";
import * as path from "path";
import { generateNativeColorsSource } from "./nativeColors";

(async () => {
    const projectRootDirPath = process.cwd();

    const targetFilePath = path.join(projectRootDirPath, "src/native/tokens/colors.ts");

    const source = await generateNativeColorsSource({ projectRootDirPath });

    const previousSource = fs.existsSync(targetFilePath)
        ? fs.readFileSync(targetFilePath).toString("utf8")
        : undefined;

    if (previousSource === source) {
        console.log(
            `[tokens:sync] ${path.relative(projectRootDirPath, targetFilePath)} is up to date.`
        );

        return;
    }

    fs.writeFileSync(targetFilePath, source);

    console.log(
        `[tokens:sync] wrote ${path.relative(projectRootDirPath, targetFilePath)} from the SGE CSS tokens.`
    );
})();

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as css from "css";

export function patchCssForMui(params: { rawLegacyCssCode: string }) {
    const { rawLegacyCssCode } = params;

    const parsedCss = css.parse(rawLegacyCssCode);

    (function callee(rules: any[], media: string): any[] {
        return [
            ...rules.filter(({ type }) => type === "rule").map(rule => [rule, media]),
            ...rules
                .filter(({ type }) => type === "media")
                .map(({ rules, media }) => callee(rules, media))
                .flat()
        ];
    })(parsedCss.stylesheet!.rules as any[], "root").forEach(
        ([rule, media]) =>
            (rule.selectors = rule.selectors.map((selector: string) => {
                const selectorNotMui = `${selector}:not([class^="Mui"])`;

                if (media === "(hover: hover) and (pointer: fine)") {
                    if (
                        selector === "button:not(:disabled):hover" ||
                        selector === "button:not(:disabled):active"
                    ) {
                        return selectorNotMui;
                    }
                }

                return selector;
            }))
    );

    return {
        "rawLegacyCssCodePatchedForMui": css.stringify(parsedCss, { "compress": false }),
        "rawLegacyCssCodePatchedForMuiMinified": css.stringify(parsedCss, { "compress": true })
    };
}

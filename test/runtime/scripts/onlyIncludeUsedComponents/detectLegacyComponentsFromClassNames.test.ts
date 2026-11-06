import { it, expect, describe } from "vitest";
import { detectLegacyComponentsFromClassNames } from "../../../../src/bin/only-include-css-of-used-components";

describe("detectLegacyComponentsFromClassNames", () => {
    it("detects raw usage of legacy component classes", () => {
        const rawFileContent = `
            export function MyTable() {
                return <div className="fr-table">
                    <span className={fr.cx("fr-badge", "fr-badge--success")} />
                </div>;
            }
        `;

        const detected = detectLegacyComponentsFromClassNames({ rawFileContent });

        expect(detected).toContain("table");
        expect(detected).toContain("badge");
        expect(detected).not.toContain("header");
    });

    it("detects modifier classes thanks to prefix matching", () => {
        const detected = detectLegacyComponentsFromClassNames({
            "rawFileContent": `<button class="fr-btn fr-btn--secondary">Ok</button>`
        });

        expect(detected).toStrictEqual(["button"]);
    });

    it("detects nothing in files without fr- classes", () => {
        expect(
            detectLegacyComponentsFromClassNames({
                "rawFileContent": `const theme = { "color": "blue" };`
            })
        ).toStrictEqual([]);
    });
});

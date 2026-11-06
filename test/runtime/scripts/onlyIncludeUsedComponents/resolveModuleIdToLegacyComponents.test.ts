import { it, expect, describe } from "vitest";
import {
    resolveModuleIdToLegacyComponents,
    REACT_LEGACY_MODULE_TO_LEGACY_COMPONENTS,
    LEGACY_COMPONENTS_CASCADE_ORDER
} from "../../../../src/bin/only-include-css-of-used-components";

describe("resolveModuleIdToLegacyComponents", () => {
    it("resolves a component module with its transitive dependencies", () => {
        const legacyComponents = resolveModuleIdToLegacyComponents({ "moduleId": "Header" });

        expect(legacyComponents).not.toBe(undefined);

        for (const expected of ["header", "navigation", "modal", "logo", "search"]) {
            expect(legacyComponents).toContain(expected);
        }
    });

    it("resolves known non component modules to no component", () => {
        for (const moduleId of ["fr", "i18n", "spa", "mui", "next-appdir", "useIsDark"]) {
            expect(resolveModuleIdToLegacyComponents({ moduleId })).toStrictEqual([]);
        }
    });

    it("resolves direct legacy component stylesheet imports", () => {
        expect(
            resolveModuleIdToLegacyComponents({ "moduleId": "legacy/component/table" })
        ).toStrictEqual(["table"]);

        expect(
            resolveModuleIdToLegacyComponents({ "moduleId": "legacy/utility/colors" })
        ).toStrictEqual([]);
    });

    it("returns undefined for unknown component looking modules", () => {
        expect(resolveModuleIdToLegacyComponents({ "moduleId": "BrandNewComponent" })).toBe(
            undefined
        );
    });

    it("only maps to components that exist in the cascade order", () => {
        for (const legacyComponents of Object.values(REACT_LEGACY_MODULE_TO_LEGACY_COMPONENTS)) {
            for (const componentName of legacyComponents) {
                expect(LEGACY_COMPONENTS_CASCADE_ORDER).toContain(componentName);
            }
        }
    });
});

describe("resolveModuleIdToLegacyComponents, modules rendering legacy markup", () => {
    it("resolves the modules that render legacy markup without being components", () => {
        // src/link.tsx renders a `fr-link` button when the Link is a button.
        expect(resolveModuleIdToLegacyComponents({ "moduleId": "link" })).toStrictEqual(["link"]);

        // src/shared/Fieldset.tsx renders fr-fieldset, fr-label, fr-hint-text and fr-radio-rich.
        const legacyComponents = resolveModuleIdToLegacyComponents({ "moduleId": "shared" });

        for (const expected of ["form", "radio", "checkbox"]) {
            expect(legacyComponents).toContain(expected);
        }
    });

    it("returns undefined for an unknown legacy component stylesheet", () => {
        expect(resolveModuleIdToLegacyComponents({ "moduleId": "legacy/component/brandNew" })).toBe(
            undefined
        );
    });

    it("returns undefined for an unknown lowercase module", () => {
        for (const moduleId of ["v", "dist"]) {
            expect(resolveModuleIdToLegacyComponents({ moduleId })).toBe(undefined);
        }
    });
});

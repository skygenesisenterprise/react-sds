import { it, expect, describe } from "vitest";
import {
    getReactDsfrImportedModuleIds,
    ROOT_IMPORT_MODULE_ID
} from "../../../../src/bin/only-include-css-of-used-components";

describe("getReactDsfrImportedModuleIds", () => {
    it("detects default and named imports from a component subpath", () => {
        const rawFileContent = `
            import { Button } from "@skygenesisenterprise/react-sds/Button";
            import Badge from "@skygenesisenterprise/react-sds/Badge";
        `;

        expect(getReactDsfrImportedModuleIds({ rawFileContent }).sort()).toStrictEqual([
            "Badge",
            "Button"
        ]);
    });

    it("flags imports of the package root (main entry), whatever the import form", () => {
        const rawFileContent = `
            import { fr } from "@skygenesisenterprise/react-sds";
            import { Button, Alert } from "@skygenesisenterprise/react-sds";
            const { Card } = await import("@skygenesisenterprise/react-sds");
            const { Header } = require("@skygenesisenterprise/react-sds");
        `;

        // A root import can pull any component: it must be reported (so that the caller
        // can fall back to including every component), not silently dropped.
        expect(getReactDsfrImportedModuleIds({ rawFileContent })).toStrictEqual([
            ROOT_IMPORT_MODULE_ID
        ]);
    });

    it("detects deep imports and normalizes them to their module", () => {
        const rawFileContent = `
            import { useIsModalOpen } from "@skygenesisenterprise/react-sds/Modal/useIsModalOpen";
            import { createModal } from "@skygenesisenterprise/react-sds/Modal";
            const { Header } = await import("@skygenesisenterprise/react-sds/Header/index");
            const x = require("@skygenesisenterprise/react-sds/Tabs.js");
        `;

        expect(getReactDsfrImportedModuleIds({ rawFileContent }).sort()).toStrictEqual([
            "Header",
            "Modal",
            "Tabs"
        ]);
    });

    it("keeps two segments for blocks and three for dsfr asset paths", () => {
        const rawFileContent = `
            import { PasswordInput } from "@skygenesisenterprise/react-sds/blocks/PasswordInput";
            import "@skygenesisenterprise/react-sds/dsfr/component/table/table.min.css";
            import "@skygenesisenterprise/react-sds/dsfr/utility/colors/colors.min.css";
        `;

        expect(getReactDsfrImportedModuleIds({ rawFileContent }).sort()).toStrictEqual([
            "blocks/PasswordInput",
            "dsfr/component/table",
            "dsfr/utility/colors"
        ]);
    });

    it("returns no module for files that do not use react-sds", () => {
        const rawFileContent = `
            import { useState } from "react";
            import { z } from "zod";
        `;

        expect(getReactDsfrImportedModuleIds({ rawFileContent })).toStrictEqual([]);
    });
});

describe("getReactDsfrImportedModuleIds, non import occurrences", () => {
    it("ignores urls and comments that merely mention the package", () => {
        const rawFileContent = `
            // see https://www.npmjs.com/package/@skygenesisenterprise/react-sds/v/1.32.5
            <link rel="stylesheet" href="https://unpkg.com/@skygenesisenterprise/react-sds/dist/dsfr/dsfr.min.css" />
            /* @skygenesisenterprise/react-sds/Header is not imported here */
        `;

        expect(getReactDsfrImportedModuleIds({ rawFileContent })).toStrictEqual([]);
    });

    it("still detects the import when it sits next to a mention", () => {
        const rawFileContent = `
            // https://www.npmjs.com/package/@skygenesisenterprise/react-sds/v/1.32.5
            import { Button } from "@skygenesisenterprise/react-sds/Button";
        `;

        expect(getReactDsfrImportedModuleIds({ rawFileContent })).toStrictEqual(["Button"]);
    });

    it("detects @import of a stylesheet", () => {
        expect(
            getReactDsfrImportedModuleIds({
                "rawFileContent": `@import "@skygenesisenterprise/react-sds/dsfr/component/table/table.min.css";`
            })
        ).toStrictEqual(["dsfr/component/table"]);
    });
});

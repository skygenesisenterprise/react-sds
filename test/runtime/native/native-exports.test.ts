import { describe, it, expect, vi } from "vitest";
import * as fs from "fs";
import { join as pathJoin } from "path";

vi.mock("react-native", () => import("./react-native-mock"));

import * as native from "../../../src/native";

const projectRootDirPath = process.cwd();

describe("SDS Native public API (exports)", () => {
    it("provides the @skygenesisenterprise/react-sds/native entry source", () => {
        // The subpath entry compiles to dist/native (published at the package
        // root as native/index.js); its source lives in src/native/index.ts.
        const indexPath = pathJoin(projectRootDirPath, "src", "native", "index.ts");

        expect(fs.existsSync(indexPath)).toBe(true);

        const indexSource = fs.readFileSync(indexPath).toString("utf8");

        // The entry is a thin aggregator of the token/theme/primitives/components layers.
        expect(indexSource).toContain('./tokens');
        expect(indexSource).toContain('./theme');
        expect(indexSource).toContain('./primitives');
        expect(indexSource).toContain('./components');
    });

    it("exposes foundation primitives", () => {
        for (const name of ["Text", "Heading", "Icon", "Divider", "Stack", "Container"]) {
            expect(native[name], `missing export ${name}`).toBeDefined();
        }
    });

    it("exposes action components", () => {
        for (const name of ["Button", "IconButton", "Link"]) {
            expect(native[name], `missing export ${name}`).toBeDefined();
        }
    });

    it("exposes form components", () => {
        for (const name of ["Input", "TextArea", "Checkbox", "Radio", "RadioGroup", "Switch", "Select"]) {
            expect(native[name], `missing export ${name}`).toBeDefined();
        }
    });

    it("exposes feedback components", () => {
        for (const name of ["Alert", "Badge", "Status", "Progress", "Loading"]) {
            expect(native[name], `missing export ${name}`).toBeDefined();
        }
    });

    it("exposes layout components", () => {
        for (const name of ["Card", "List", "ListItem", "Section", "Avatar"]) {
            expect(native[name], `missing export ${name}`).toBeDefined();
        }
    });

    it("exposes navigation primitives (graphical only)", () => {
        for (const name of ["Header", "TabBar", "NavItem"]) {
            expect(native[name], `missing export ${name}`).toBeDefined();
        }
    });

    it("exposes government components", () => {
        for (const name of [
            "ServiceCard",
            "ProcedureCard",
            "DocumentCard",
            "NotificationCard",
            "IdentityBadge",
            "StatusBadge",
            "GovernmentBanner"
        ]) {
            expect(native[name], `missing export ${name}`).toBeDefined();
        }
    });

    it("exposes the theme provider and tokens", () => {
        expect(native.SDSProvider).toBeDefined();
        expect(native.useSDSTheme).toBeDefined();
        expect(native.sdsTokens).toBeDefined();
        expect(native.defaultSDSTokens).toBeDefined();
    });
});
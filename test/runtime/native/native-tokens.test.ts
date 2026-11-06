import { describe, it, expect, vi } from "vitest";

vi.mock("react-native", () => import("./react-native-mock"));

import { sdsTokens, sdsColors, sdsSpacing, sdsRadius, sdsDimensions } from "../../../src/native/tokens";

describe("SDS Native tokens", () => {
    it("exposes the full SDSTokens contract", () => {
        expect(sdsTokens.colors).toBeDefined();
        expect(sdsTokens.darkColors).toBeDefined();
        expect(sdsTokens.typography).toBeDefined();
        expect(sdsTokens.spacing).toBeDefined();
        expect(sdsTokens.radius).toBeDefined();
        expect(sdsTokens.elevation).toBeDefined();
        expect(sdsTokens.dimensions).toBeDefined();
        expect(sdsTokens.motion).toBeDefined();
    });

    it("covers the required semantic colors", () => {
        const required = [
            "background",
            "foreground",
            "primary",
            "secondary",
            "accent",
            "success",
            "warning",
            "error",
            "info",
            "border",
            "muted",
            "disabled",
            "text",
            "textMuted"
        ];

        for (const key of required) {
            expect(sdsColors[key], `missing color token "${key}"`).toBeDefined();
        }
    });

    it("exposes spacing scale steps xs..xl", () => {
        expect(sdsSpacing.xs).toBe(4);
        expect(sdsSpacing.sm).toBe(8);
        expect(sdsSpacing.md).toBe(16);
        expect(sdsSpacing.lg).toBe(24);
        expect(sdsSpacing.xl).toBe(32);
    });

    it("exposes radius tokens sm/md/lg/full", () => {
        expect(sdsRadius.sm).toBeGreaterThan(0);
        expect(sdsRadius.md).toBeGreaterThan(sdsRadius.sm);
        expect(sdsRadius.lg).toBeGreaterThan(sdsRadius.md);
        expect(sdsRadius.full).toBeGreaterThan(sdsRadius.lg);
    });

    it("respects a thumb-friendly touch target", () => {
        expect(sdsDimensions.touchTarget).toBeGreaterThanOrEqual(44);
        expect(sdsDimensions.controlMd).toBeGreaterThanOrEqual(44);
    });

    it("provides mobile-adapted control heights", () => {
        expect(sdsDimensions.controlLg).toBeGreaterThan(sdsDimensions.controlMd);
        expect(sdsDimensions.controlMd).toBeGreaterThan(sdsDimensions.controlSm);
    });
});
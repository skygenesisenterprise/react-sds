import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
    SDSPage,
    SDSMain,
    SDSContainer,
    SDSSection,
    SDSStack,
    SDSGrid,
    SDSColumns
} from "../../../src/sds/layout";

describe("SDS layout primitives", () => {
    it("SDSPage renders a full-height shell with a stable class", () => {
        const html = renderToStaticMarkup(createElement(SDSPage, null, "contenu"));
        expect(html).toContain('class="sds-page"');
        expect(html).toContain("contenu");
    });

    it("SDSMain renders the main landmark with a default skip-link id", () => {
        const html = renderToStaticMarkup(createElement(SDSMain, null, "x"));
        expect(html).toContain('<main id="contenu"');
        expect(html).toContain('class="sds-main"');

        const custom = renderToStaticMarkup(createElement(SDSMain, { "id": "principal" }, "x"));
        expect(custom).toContain('id="principal"');
    });

    it("SDSContainer maps the size prop to a data attribute", () => {
        const html = renderToStaticMarkup(createElement(SDSContainer, { "size": "wide" }, "x"));
        expect(html).toContain('class="sds-container"');
        expect(html).toContain('data-size="wide"');

        const defaults = renderToStaticMarkup(createElement(SDSContainer, null, "x"));
        expect(defaults).toContain('data-size="default"');
    });

    it("SDSSection renders a semantic section and optional heading", () => {
        const html = renderToStaticMarkup(
            createElement(SDSSection, { "tone": "subtle", "title": "Actualités" }, "corps")
        );
        expect(html).toContain('<section class="sds-section" data-tone="subtle"');
        expect(html).toContain('class="sds-section__title"');
        expect(html).toContain("Actualités");
        expect(html).toContain("corps");
    });

    it("SDSStack sets the gap and align data attributes", () => {
        const html = renderToStaticMarkup(createElement(SDSStack, { "gap": 8, "align": "center" }, "x"));
        expect(html).toContain('class="sds-stack"');
        expect(html).toContain('data-gap="8"');
        expect(html).toContain('data-align="center"');
    });

    it("SDSGrid maps responsive columns and cascades defaults", () => {
        const html = renderToStaticMarkup(
            createElement(SDSGrid, { "columns": { "mobile": 1, "tablet": 2, "desktop": 3 }, "gap": 6 }, "x")
        );
        expect(html).toContain('data-cols-sm="1"');
        expect(html).toContain('data-cols-md="2"');
        expect(html).toContain('data-cols-lg="3"');
        expect(html).toContain('data-gap="6"');

        // defaults: tablet inherits mobile, desktop inherits tablet
        const defaults = renderToStaticMarkup(createElement(SDSGrid, { "columns": { "mobile": 2 } }, "x"));
        expect(defaults).toContain('data-cols-sm="2"');
        expect(defaults).toContain('data-cols-md="2"');
        expect(defaults).toContain('data-cols-lg="2"');
    });

    it("SDSColumns wraps each child in a column item", () => {
        const html = renderToStaticMarkup(
            createElement(SDSColumns, { "cols": 3, "gap": 6 }, createElement("div", null, "a"), createElement("div", null, "b"))
        );
        const items = html.match(/sds-columns__item/g) ?? [];
        expect(items.length).toBe(2);
        expect(html).toContain('data-cols="3"');
        expect(html).toContain('data-gap="6"');
    });

    it("exported from the SDS root barrel", async () => {
        const sds = await import("../../../src/sds");
        for (const name of ["SDSPage", "SDSMain", "SDSContainer", "SDSSection", "SDSStack", "SDSGrid", "SDSColumns"]) {
            expect(typeof sds[name]).toBe("function");
        }
    });
});
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
    SDSHeading,
    SDSText,
    SDSLead,
    SDSLink
} from "../../../src/sds/typography";

describe("SDS typography primitives", () => {
    it("SDSHeading renders the correct semantic tag and level", () => {
        const html = renderToStaticMarkup(createElement(SDSHeading, { "level": 1 }, "Titre"));
        expect(html).toMatch(/^<h1 /);
        expect(html).toContain('data-level="1"');
        expect(html).toContain('class="sds-heading"');

        const h3 = renderToStaticMarkup(createElement(SDSHeading, { "level": 3 }, "T"));
        expect(h3).toMatch(/^<h3 /);
    });

    it("SDSHeading supports an explicit size override", () => {
        const html = renderToStaticMarkup(
            createElement(SDSHeading, { "level": 2, "size": 5 }, "T")
        );
        expect(html).toContain('data-level="2"');
        expect(html).toContain('data-size="5"');
    });

    it("SDSText maps size / weight / color / margin / align props", () => {
        const html = renderToStaticMarkup(
            createElement(SDSText, {
                "size": "lg",
                "weight": "bold",
                "color": "muted",
                "margin": "bottom",
                "align": "center"
            }, "Texte")
        );
        expect(html).toContain('class="sds-text"');
        expect(html).toContain('data-size="lg"');
        expect(html).toContain('data-weight="bold"');
        expect(html).toContain('data-color="muted"');
        expect(html).toContain('data-margin="bottom"');
        expect(html).toContain('data-align="center"');
    });

    it("SDSText renders the requested tag", () => {
        const html = renderToStaticMarkup(createElement(SDSText, { "as": "span" }, "T"));
        expect(html).toMatch(/^<span /);
    });

    it("SDSLead renders a lead paragraph", () => {
        const html = renderToStaticMarkup(createElement(SDSLead, null, "Intro"));
        expect(html).toContain('class="sds-lead"');
        expect(html).toContain("Intro");
    });

    it("SDSLink renders href, variant and external target", () => {
        const html = renderToStaticMarkup(
            createElement(SDSLink, { "href": "/a", "external": true }, "Lien")
        );
        expect(html).toContain('href="/a"');
        expect(html).toContain('target="_blank"');
        expect(html).toContain('rel="noreferrer noopener"');
        expect(html).toContain('class="sds-link"');

        const action = renderToStaticMarkup(
            createElement(SDSLink, { "href": "/b", "variant": "action", "iconId": "fr-icon-arrow-right-line" }, "Voir")
        );
        expect(action).toContain("sds-link--action");
        expect(action).toContain('data-variant="action"');
        expect(action).toContain("fr-icon-arrow-right-line");
    });

    it("SDSLink honors the disabled state", () => {
        const html = renderToStaticMarkup(createElement(SDSLink, { "href": "/c", "disabled": true }, "T"));
        expect(html).not.toContain('href="/c"');
        expect(html).toContain('aria-disabled="true"');
    });
});
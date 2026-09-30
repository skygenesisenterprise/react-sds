import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
    SDSPortal,
    SDSGovernmentHeader,
    SDSMinistryHeader,
    SDSGovernmentFooter,
    SDSHero,
    SDSServiceBanner,
    SDSOfficialNotice,
    SDSBreadcrumb,
    SDSNavigation,
    SDSMegaMenu,
    SDSSearch,
    SDSPagination
} from "../../../src/sds/portal";

describe("SDS government portal components", () => {
    it("SDSPortal wraps children and sets the lang", () => {
        const html = renderToStaticMarkup(
            createElement(SDSPortal, { "organization": "Ministère de la Défense" }, "contenu")
        );
        expect(html).toContain('class="sds-portal"');
        expect(html).toContain('lang="fr"');
        expect(html).toContain("contenu");
    });

    it("SDSGovernmentHeader reads the organization from SDSPortal context", () => {
        const html = renderToStaticMarkup(
            createElement(
                SDSPortal,
                { "organization": "Ministère de la Défense" },
                createElement(SDSGovernmentHeader)
            )
        );
        expect(html).toContain('class="sds-gov-header"');
        expect(html).toContain("Ministère de la Défense");
    });

    it("SDSMinistryHeader renders a compact strip", () => {
        const html = renderToStaticMarkup(
            createElement(SDSMinistryHeader, { "organization": "Justice" })
        );
        expect(html).toContain('class="sds-ministry-header"');
        expect(html).toContain("Justice");
    });

    it("SDSGovernmentFooter renders columns and bottom links", () => {
        const html = renderToStaticMarkup(
            createElement(SDSGovernmentFooter, {
                "organization": "Défense",
                "columns": [{ "title": "Formulaires", "links": [{ "label": "Demande", "href": "/d" }] }],
                "bottomLinks": [{ "label": "Mentions légales", "href": "/leg" }]
            })
        );
        expect(html).toContain('class="sds-gov-footer"');
        expect(html).toContain("Formulaires");
        expect(html).toContain("Demande");
        expect(html).toContain("Mentions légales");
        expect(html).toContain("Défense");
    });

    it("SDSHero renders a primary hero with title/subtitle/actions", () => {
        const html = renderToStaticMarkup(
            createElement(SDSHero, { "title": "Bienvenue", "subtitle": "Sous-titre" })
        );
        expect(html).toContain('class="sds-hero"');
        expect(html).toContain('data-tone="primary"');
        expect(html).toContain('class="sds-hero__title"');
        expect(html).toContain("Sous-titre");
    });

    it("SDSServiceBanner sets a role and a tone icon", () => {
        const html = renderToStaticMarkup(
            createElement(SDSServiceBanner, { "tone": "warning", "title": "Maintenance" }, "texte")
        );
        expect(html).toContain('role="status"');
        expect(html).toContain('data-tone="warning"');
        expect(html).toContain("Maintenance");
    });

    it("SDSOfficialNotice renders the legal strip", () => {
        const html = renderToStaticMarkup(createElement(SDSOfficialNotice, null, "République d'SGE"));
        expect(html).toContain('class="sds-official-notice"');
    });

    it("SDSBreadcrumb marks the last item as current", () => {
        const html = renderToStaticMarkup(
            createElement(SDSBreadcrumb, {
                "items": [
                    { "label": "Accueil", "href": "/" },
                    { "label": "Page actuelle" }
                ]
            })
        );
        expect(html).toContain('aria-label="Fil d');
        expect(html).toContain("Ariane");
        expect(html).toContain('aria-current="page"');
        expect(html).toContain('href="/"');
    });

    it("SDSNavigation marks the active item with aria-current", () => {
        const html = renderToStaticMarkup(
            createElement(SDSNavigation, {
                "items": [
                    { "label": "Accueil", "href": "/", "active": true },
                    { "label": "Services", "href": "/services" }
                ]
            })
        );
        expect(html).toContain('aria-current="page"');
        expect(html).toContain('href="/services"');
    });

    it("SDSMegaMenu renders a closed, accessible panel", () => {
        const html = renderToStaticMarkup(
            createElement(SDSMegaMenu, {
                "label": "Démarches",
                "columns": [{ "title": "Scolarité", "links": [{ "label": "Bourse", "href": "/bourse" }] }]
            })
        );
        expect(html).toContain('class="sds-mega-menu__trigger"');
        expect(html).toContain('aria-expanded="false"');
        expect(html).toContain("hidden");
    });

    it("SDSSearch renders an accessible labelled input and submit", () => {
        const html = renderToStaticMarkup(createElement(SDSSearch));
        expect(html).toContain('role="search"');
        expect(html).toContain('type="search"');
        expect(html).toContain('class="sds-search__button"');
    });

    it("SDSPagination renders pages with an ellipsis and current page", () => {
        const html = renderToStaticMarkup(
            createElement(SDSPagination, { "currentPage": 5, "pageCount": 10 })
        );
        expect(html).toContain('aria-label="Pagination"');
        expect(html).toContain('aria-current="page"');
        expect(html).toContain("…");
    });
});
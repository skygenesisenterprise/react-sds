import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
    SDSCard,
    SDSTeaserCard,
    SDSArticleCard,
    SDSNewsList,
    SDSLinkList,
    SDSDocument,
    SDSDownload,
    SDSEvent,
    SDSMeetingCard
} from "../../../src/sds/content";

describe("SDS content components", () => {
    it("SDSCard renders title, description, media, tag, footer and link title", () => {
        const html = renderToStaticMarkup(
            createElement(SDSCard, {
                "href": "/x",
                "title": "Titre",
                "description": "Desc",
                "tag": "Actu",
                "footer": "Pied"
            })
        );
        expect(html).toContain('class="sds-card"');
        expect(html).toContain('class="sds-card__title"');
        expect(html).toContain('href="/x"');
        expect(html).toContain('class="sds-card__tag"');
        expect(html).toContain("Actu");
        expect(html).toContain("Desc");
        expect(html).toContain("Pied");
    });

    it("SDSTeaserCard renders a call-to-action link", () => {
        const html = renderToStaticMarkup(
            createElement(SDSTeaserCard, { "href": "/t", "title": "T", "description": "D" })
        );
        expect(html).toContain('class="sds-teaser-card"');
        expect(html).toContain('class="sds-teaser-card__action"');
        expect(html).toContain("fr-icon-arrow-right-line");
    });

    it("SDSArticleCard renders date, image and a read-more link", () => {
        const html = renderToStaticMarkup(
            createElement(SDSArticleCard, { "href": "/a", "title": "T", "date": "12 janv. 2026", "image": createElement("img", { "src": "/i.jpg", "alt": "" }) })
        );
        expect(html).toContain('class="sds-article-card"');
        expect(html).toContain('class="sds-article-card__media"');
        expect(html).toContain("12 janv. 2026");
        expect(html).toContain("Lire la suite");
    });

    it("SDSNewsList renders a list of article cards", () => {
        const html = renderToStaticMarkup(
            createElement(SDSNewsList, {
                "items": [
                    { "title": "A", "href": "/a" },
                    { "title": "B", "href": "/b" }
                ]
            })
        );
        expect(html).toMatch(/^<ul /);
        const cards = html.match(/class="sds-article-card"/g) ?? [];
        expect(cards.length).toBe(2);
    });

    it("SDSLinkList renders a bordered list of links with descriptions", () => {
        const html = renderToStaticMarkup(
            createElement(SDSLinkList, {
                "title": "Liens utiles",
                "items": [
                    { "label": "Formulaires", "href": "/form", "description": "Accès aux démarches" }
                ]
            })
        );
        expect(html).toContain('class="sds-link-list"');
        expect(html).toContain("Formulaires");
        expect(html).toContain("Accès aux démarches");
        expect(html).toContain('href="/form"');
    });

    it("SDSDocument renders file meta line", () => {
        const html = renderToStaticMarkup(
            createElement(SDSDocument, { "href": "/r.pdf", "title": "Rapport", "fileType": "PDF", "fileSize": "1,2 Mo" })
        );
        expect(html).toContain('class="sds-document"');
        expect(html).toContain("PDF · 1,2 Mo");
        expect(html).toContain('href="/r.pdf"');
    });

    it("SDSDownload renders a download link", () => {
        const html = renderToStaticMarkup(
            createElement(SDSDownload, { "href": "/r.pdf", "label": "Télécharger", "fileType": "PDF" })
        );
        expect(html).toContain('class="sds-download"');
        expect(html).toContain('download');
        expect(html).toContain("Télécharger");
        expect(html).toContain("PDF");
    });

    it("SDSEvent formats the date and renders location/time", () => {
        const html = renderToStaticMarkup(
            createElement(SDSEvent, { "date": "2026-01-12", "title": "Réunion", "location": "Paris", "time": "14h00" })
        );
        expect(html).toContain('class="sds-event"');
        expect(html).toContain("12");
        expect(html).toContain("janv.");
        expect(html).toContain("Paris");
        expect(html).toContain("14h00");
    });

    it("SDSMeetingCard renders an attendees line", () => {
        const html = renderToStaticMarkup(
            createElement(SDSMeetingCard, { "date": "2026-02-01", "title": "Comité", "attendees": "25 inscrits" })
        );
        expect(html).toContain('class="sds-meeting-card"');
        expect(html).toContain("25 inscrits");
    });
});
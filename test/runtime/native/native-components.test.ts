import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

vi.mock("react-native", () => import("./react-native-mock"));

import { Button } from "../../../src/native/components/Button";
import { Text } from "../../../src/native/primitives/Text";
import { Heading } from "../../../src/native/primitives/Heading";
import { Checkbox } from "../../../src/native/components/Checkbox";
import { Alert } from "../../../src/native/components/Alert";

const render = (element: React.ReactElement) => renderToStaticMarkup(element);

describe("SDS Native component smoke tests (react-native mocked)", () => {
    it("Text renders its children", () => {
        const html = render(createElement(Text, undefined, "Hello SDS"));

        expect(html).toContain("Hello SDS");
    });

    it("Heading exposes accessibilityRole=header", () => {
        const html = render(createElement(Heading, { "level": 1 }, "Titre"));

        expect(html).toContain('accessibilityRole="header"');
        expect(html).toContain("Titre");
    });

    it("Button renders with role=button", () => {
        const html = render(createElement(Button, undefined, "Continuer"));

        expect(html).toContain('accessibilityRole="button"');
        expect(html).toContain("Continuer");
    });

    it("Button disabled state is exposed to assistive tech", () => {
        const html = render(createElement(Button, { disabled: true }, "Continuer"));

        expect(html).toContain('accessibilityState="{&quot;disabled&quot;:true,&quot;busy&quot;:false}"');
    });

    it("Button loading state renders an activity indicator", () => {
        const html = render(createElement(Button, { loading: true }, "Continuer"));

        expect(html).toContain("activityindicator");
    });

    it("Checkbox exposes checked state", () => {
        const html = render(createElement(Checkbox, { checked: true, "label": "Accepter" }));

        expect(html).toContain('accessibilityRole="checkbox"');
        expect(html).toContain('accessibilityState="{&quot;checked&quot;:true,&quot;disabled&quot;:false}"');
        expect(html).toContain("Accepter");
    });

    it("Alert exposes an alert role", () => {
        const html = render(
            createElement(Alert, { "severity": "error", "title": "Erreur" }, "Un problème est survenu.")
        );

        expect(html).toContain('accessibilityRole="alert"');
        expect(html).toContain("Erreur");
    });
});
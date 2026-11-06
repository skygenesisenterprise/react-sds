import { Html, Head, Main, NextScript } from "next/document";
import type { DocumentProps } from "next/document";
import { legacyDocumentApi, augmentDocumentWithEmotionCache } from "./_app";

const { augmentDocumentForLegacy, getColorSchemeHtmlAttributes } = legacyDocumentApi;

export default function Document(props: DocumentProps) {
    return (
        <Html {...getColorSchemeHtmlAttributes(props)}>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

augmentDocumentForLegacy(Document);

augmentDocumentWithEmotionCache(Document);

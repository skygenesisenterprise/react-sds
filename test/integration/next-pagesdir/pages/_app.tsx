import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { createNextSdsIntegrationApi } from "@skygenesisenterprise/react-sds/next-pagesdir";
import { headerFooterDisplayItem } from "@skygenesisenterprise/react-sds/Display";
import { Header } from "@skygenesisenterprise/react-sds/Header";
import { Footer } from "@skygenesisenterprise/react-sds/Footer";
import { createEmotionSsrAdvancedApproach } from "tss-react/next/pagesDir";
import { useStyles } from "tss-react/legacy";
import { fr } from "@skygenesisenterprise/react-sds";
import Link from "next/link";

declare module "@skygenesisenterprise/react-sds/next-pagesdir" {
    interface RegisterLink {
        Link: typeof Link;
    }
}

const {
    withLegacy,
    legacyDocumentApi
} = createNextSdsIntegrationApi({
    "defaultColorScheme": "system",
    Link,
    "preloadFonts": [
        //"Marianne-Light",
        //"Marianne-Light_Italic",
        "Marianne-Regular",
        //"Marianne-Regular_Italic",
        "Marianne-Medium",
        //"Marianne-Medium_Italic",
        "Marianne-Bold"
        //"Marianne-Bold_Italic",
        //"Spectral-Regular",
        //"Spectral-ExtraBold"
    ]
});

const { augmentDocumentWithEmotionCache, withAppEmotionCache } = createEmotionSsrAdvancedApproach({
    "key": "css"
});

export { legacyDocumentApi, augmentDocumentWithEmotionCache };

function App({ Component, pageProps }: AppProps) {

    const { css } = useStyles();

    const router = useRouter()

    return (
        <>
            <div
                style={{
                    "minHeight": "100vh",
                    "display": "flex",
                    "flexDirection": "column"
                }}
            >
                <Header
                    identity={{
                        imgUrl: "/sge-identity.svg",
                        alt: "Sky Genesis Enterprise",
                        institution: "Sky Genesis Enterprise"
                    }}
                    serviceTitle="Nom du site / service"
                    homeLinkProps={{
                        "href": "/",
                        "title": "Accueil - Sky Genesis Enterprise"
                    }}
                    navigation={[
                        {
                            "text": "Home",
                            "linkProps": {
                                "href": "/"
                            },
                            "isActive": router.asPath === "/"
                        },
                        {
                            "text": "Mui playground",
                            "linkProps": {
                                "href": "/mui"
                            },
                            "isActive": router.asPath === "/mui"
                        },
                        {
                            "text": "External link",
                            "linkProps": {
                                "href": "https://example.com"
                            }
                        }
                    ]}
                    quickAccessItems={[
                        headerFooterDisplayItem,
                        {
                            iconId: "ri-mail-line",
                            linkProps: {
                                href: `mailto:${"contact@example.com"}`,
                            },
                            text: "Nous contacter",
                        }
                    ]}
                />
                <div className={css({
                    "flex": 1,
                    "margin": "auto",
                    "maxWidth": 1000,
                    ...fr.spacing("padding", {
                        "topBottom": "10v"
                    })
                })}>
                    <Component {...pageProps} />
                </div>
                <Footer
                    accessibility="fully compliant"
                    contentDescription={`
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                        eu fugiat nulla pariatur. 
                    `}
                    bottomItems={[headerFooterDisplayItem]}
                />
            </div>
        </>
    );
}

export default withAppEmotionCache(withLegacy(App));

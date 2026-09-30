import { NextAppDirEmotionCacheProvider } from "tss-react/next";
import { DsfrHead } from "@skygenesisenterprise/react-sds/next-appdir/DsfrHead";
import { DsfrProvider } from "@skygenesisenterprise/react-sds/next-appdir/DsfrProvider";
import { getHtmlAttributes } from "@skygenesisenterprise/react-sds/next-appdir/getHtmlAttributes";
import { StartDsfr } from "./StartDsfr";
import { defaultColorScheme } from "./defaultColorScheme";
import MuiDsfrThemeProvider from "@skygenesisenterprise/react-sds/mui";
import { Header } from "@skygenesisenterprise/react-sds/Header";
import { Footer } from "@skygenesisenterprise/react-sds/Footer";
import { headerFooterDisplayItem, addDisplayTranslations } from "@skygenesisenterprise/react-sds/Display";
import { fr } from "@skygenesisenterprise/react-sds";
import { Navigation } from "./Navigation";
import Link from "next/link";
import {
    ConsentBannerAndConsentManagement,
    FooterConsentManagementItem,
    FooterPersonalDataPolicyItem
} from "./consentManagement";
import { ClientFooterItem } from "../ui/ClientFooterItem";
import { ClientHeaderQuickAccessItem } from "../ui/ClientHeaderQuickAccessItem";
import { headers } from "next/headers";
import { getScriptNonceFromHeader } from "next/dist/server/app-render/get-script-nonce-from-header"; // or use your own implementation
import style from "./main.module.css";
import { cx } from "@skygenesisenterprise/react-sds/tools/cx";
import { Follow } from "./Follow";

export default function RootLayout({ children }: { children: JSX.Element }) {
    const csp = headers().get("Content-Security-Policy");
    let nonce: string | undefined;
    if (csp) {
        nonce = getScriptNonceFromHeader(csp);
    }

    //NOTE: If we had i18n setup we would get lang from the props.
    //See https://github.com/vercel/next.js/blob/canary/examples/app-dir-i18n-routing/app/%5Blang%5D/layout.tsx
    const lang = "fr";

    return (
        <html {...getHtmlAttributes({ defaultColorScheme, lang })}>
            <head>
                <title>Next 13 AppDir demo — SDS React</title>
                <StartDsfr />
                <DsfrHead
                    Link={Link}
                    preloadFonts={[
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
                    ]}
                    nonce={nonce}
                />
            </head>
            <body>
                <DsfrProvider lang={lang}>
                    <ConsentBannerAndConsentManagement />
                    <NextAppDirEmotionCacheProvider
                        options={{ "key": "css", nonce, prepend: true }}
                    >
                        <MuiDsfrThemeProvider>
                            <Header
                                identity={{
                                    imgUrl: "/sge-gouv.png",
                                    alt: "République d'SGE",
                                    institution: "Gouvernement"
                                }}
                                serviceTitle="Nom du site / service"
                                homeLinkProps={{
                                    "href": "/",
                                    "title": "Accueil - République d'SGE"
                                }}
                                quickAccessItems={[
                                    headerFooterDisplayItem,
                                    {
                                        iconId: "ri-mail-line",
                                        linkProps: {
                                            href: `mailto:${"contact@example.com"}`
                                        },
                                        text: "Nous contacter"
                                    },
                                    <ClientHeaderQuickAccessItem
                                        key={"client-header-quick-access-item"}
                                    />
                                ]}
                                navigation={<Navigation />}
                            />
                            <div className={cx(style.container)}>{children}</div>
                            <Follow />
                            <Footer
                                accessibility="fully compliant"
                                contentDescription={`
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. 
                `}
                                bottomItems={[
                                    headerFooterDisplayItem,
                                    <FooterPersonalDataPolicyItem key={"personal-data"} />,
                                    <FooterConsentManagementItem key={"consent-management"} />,
                                    <ClientFooterItem key={"client-footer"} />
                                ]}
                            />
                        </MuiDsfrThemeProvider>
                    </NextAppDirEmotionCacheProvider>
                </DsfrProvider>
            </body>
        </html>
    );
}

addDisplayTranslations({
    "lang": "fr",
    "messages": {
        "dark theme": "Thème sombre 🤩"
    }
});

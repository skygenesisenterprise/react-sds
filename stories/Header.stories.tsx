import React, { useState } from "react";
import { Header } from "../dist/Header";
import { Badge } from "../dist/Badge";
import { MainNavigation } from "../dist/MainNavigation";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import sgeGouvImgUrl from "../src/assets/sge-gouv.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Header },
    "description": `
- [See source code](https://github.com/skygenesisenterprise/react-sds/blob/main/src/Header/Header.tsx)

The Header is the **institutional signature of the Sky Genesis Enterprise**. It is built around
three levels of identity that every citizen must recognize on any public service website:

\`\`\`text
Drapeau (emblem / lockup)      ← identity.imgUrl (includes the name of the Republic)
République d'SGE
    Gouvernement                ← identity.institution
\`\`\`

- the **national identity** (flag/emblem of SGE, with the name of the Republic) is passed
  as an image (\`identity.imgUrl\` + \`identity.alt\`);
- the **administrative authority** the site belongs to (\`Gouvernement\`, \`Ministère de l'Économie\`,
  …) is displayed as a text line under the identity: \`identity.institution\`;
- the **product / portal name** (e.g. \`Portail d'information\`) is optional and lives in the
  \`serviceTitle\` / \`serviceTagline\` zone — it is never mixed with the institutional identity;
- **navigation** and **actions** (quick access items, search) are separate props.

One component covers every level of the State hierarchy: no separate
\`GovernmentHeader\` / \`MinistryHeader\` variants are needed.

\`\`\`tsx
import { Header } from "@skygenesisenterprise/react-sds/Header";

<Header
    identity={{
        imgUrl: sgeGouvImgUrl,
        alt: "République d'SGE",
        institution: "Gouvernement"
    }}
    serviceTitle="Portail d'information"
    homeLinkProps={{ href: "/", title: "Accueil - Gouvernement de la République d'SGE" }}
    navigation={navigation}
    quickAccessItems={quickAccessItems}
/>
\`\`\`

On small screens the navigation and the quick access items are available through a
purpose-built menu (open it with the burger button). You can watch if the menu modal is open
or not with the \`useIsHeaderMenuModalOpen\` hook:

\`\`\`tsx
import { useIsHeaderMenuModalOpen } from "@skygenesisenterprise/react-sds/Header/useIsHeaderMenuModalOpen";

const isOpen = useIsHeaderMenuModalOpen();
\`\`\`

> **Accessibility** — the flag/emblem image carries a meaningful \`alt\` (the Republic is named
> in the image), the identity links to the home page of the site (whole brand zone is a single
> link on large screens), the focus is visible, colors come from the theme tokens (sufficient
> contrast) and no animation is used, so \`prefers-reduced-motion\` is respected by design.

> **Note on the flag asset** — the examples below use the official SGE Government lockup
> shipped in this repository (\`src/assets/sge-gouv.png\`). Prefer a web-optimized version
> (SVG ideally) in production, cropped to the actual emblem + wordmark.

See also [\\\\<MainNavigation \\\\/\\\\>](https://skygenesisenterprise.github.io/react-sds/?path=/docs/components-mainnavigation) for the navigation prop.

`,
    "argTypes": {
        "identity": {
            "control": { "type": null },
            "description": `The institutional identity of the site, made of:
- \\`imgUrl\\`: URL of the official SGE flag/emblem lockup (SVG preferred),
- \\`alt\\`: accessible alternative of the image, the name of the Republic must appear,
- \\`institution\\`: the administrative authority, e.g. "Gouvernement" or "Ministère de l'Économie".`
        },
        "homeLinkProps": {
            "control": { "type": null },
            "description":
                "A link to the home, when the user click on the identity he must navigate to the homepage of the website"
        },
        "navigation": {
            "description":
                "Note that navigation can be an array or a custom react node, see [navigation-as-custom-node](#navigation-as-custom-node)."
        },
        "quickAccessItems": {
            "description":
                "To integrate the Dark mode switch head over to the documentation of the [Display component](https://skygenesisenterprise.github.io/react-sds/?path=/docs/components-display)"
        },
        "onSearchButtonClick": {
            "description":
                "Optional, callback called when the user click on the search button or press enter",
            "control": { "type": null }
        },
        "clearSearchInputOnSearch": {
            "description":
                "Default: false, if true the search input value will be cleared when the user click on the search button or press enter",
            "control": { "type": "boolean" }
        },
        "allowEmptySearch": {
            "description":
                "Default: false, if true the user will be able to search with an empty input, otherwise clicking on the search button or pressing enter will focus the input",
            "control": { "type": "boolean" }
        }
    },
    "disabledProps": ["lang"]
});

export default meta;

const directLinks = [
    {
        "text": "accès direct",
        "linkProps": {
            "href": "#",
            "target": "_self"
        }
    },
    {
        "text": "accès direct",
        "linkProps": {
            "href": "#",
            "target": "_self"
        },
        "isActive": true
    },
    {
        "text": "accès direct",
        "linkProps": {
            "href": "#",
            "target": "_self"
        }
    },
    {
        "text": "accès direct",
        "linkProps": {
            "href": "#",
            "target": "_self"
        }
    }
];

/** Site directly attached to the Government of the Sky Genesis Enterprise (e.g. info.gov.aor). */
export const GovernmentSite = getStory({
    "identity": {
        imgUrl: sgeGouvImgUrl,
        alt: "République d'SGE",
        institution: "Gouvernement"
    },
    "homeLinkProps": {
        "href": "/",
        "title": "Accueil - Gouvernement de la République d'SGE"
    },
    "navigation": directLinks
});

export const GovernmentSiteWithServiceTitleAndTagline = getStory({
    "identity": {
        imgUrl: sgeGouvImgUrl,
        alt: "République d'SGE",
        institution: "Gouvernement"
    },
    "homeLinkProps": {
        "href": "/",
        "title": "Accueil - Gouvernement de la République d'SGE"
    },
    "serviceTitle": "Portail d'information",
    "serviceTagline": "Les services et démarches de la République d'SGE",
    "navigation": directLinks
});

export const GovernmentSiteWithServiceTitleAndBetaBadge = getStory({
    "identity": {
        imgUrl: sgeGouvImgUrl,
        alt: "République d'SGE",
        institution: "Gouvernement"
    },
    "homeLinkProps": {
        "href": "/",
        "title": "Accueil - Gouvernement de la République d'SGE"
    },
    "serviceTitle": (
        <>
            Portail d'information{" "}
            <Badge noIcon severity="success" as="span">
                Beta
            </Badge>
        </>
    ),
    "navigation": directLinks
});

export const MinistryOfEconomy = getStory(
    {
        "identity": {
            imgUrl: sgeGouvImgUrl,
            alt: "République d'SGE",
            institution: "Ministère de l'Économie"
        },
        "homeLinkProps": {
            "href": "/",
            "title": "Accueil - Ministère de l'Économie de la République d'SGE"
        },
        "serviceTitle": "Guichet des entreprises",
        "serviceTagline": "Création, gestion et développement de votre entreprise",
        "navigation": directLinks
    },
    {
        "description": `The same component represents any institution of the Republic. The second level of the
identity ("République d'SGE", inside the lockup) stays constant, only the \`institution\`
line changes:

\`\`\`text
🇦🇴 République d'SGE      ← identity.imgUrl (flag/emblem + name)
    Ministère de l'Économie   ← identity.institution
\`\`\`

The header remains readable even when the institution name is relatively long.`
    }
);

export const MinistryOfHealth = getStory({
    "identity": {
        imgUrl: sgeGouvImgUrl,
        alt: "République d'SGE",
        institution: "Ministère de la Santé"
    },
    "homeLinkProps": {
        "href": "/",
        "title": "Accueil - Ministère de la Santé de la République d'SGE"
    },
    "serviceTitle": "Prévention et soins",
    "navigation": directLinks
});

export const WithQuickAccessItemsNavigationAndSearch = getStory(
    {
        "identity": {
            imgUrl: sgeGouvImgUrl,
            alt: "République d'SGE",
            institution: "Gouvernement"
        },
        "homeLinkProps": {
            "href": "/",
            "title": "Accueil - Gouvernement de la République d'SGE"
        },
        "serviceTitle": "Portail d'information",
        "quickAccessItems": [
            {
                "iconId": "fr-icon-add-circle-line",
                "text": "Créer un espace",
                "linkProps": {
                    "href": "#"
                }
            },
            {
                "iconId": "fr-icon-lock-line",
                "text": "Se connecter",
                "linkProps": {
                    "href": "#"
                }
            },
            {
                "iconId": "fr-icon-account-line",
                "text": "S’enregistrer",
                "linkProps": {
                    "href": "#"
                }
            }
        ],
        "navigation": directLinks,
        "onSearchButtonClick": text => alert(`TODO: implement search with text: ${text}`)
    },
    {
        "description": `The institutional identity never mixes with the navigation, the actions or the search engine.
Those stay dedicated props:

\`\`\`tsx
<Header
    identity={{ imgUrl, alt, institution: "Gouvernement" }}
    navigation={navigation}
    quickAccessItems={quickAccessItems}
    onSearchButtonClick={text => console.log(text)}
/>
\`\`\`

See below how to build dynamic quick access items (authentication buttons for instance).`
    }
);

export const HeaderQuickAccessItemsExample = getStory(
    {
        "identity": {
            imgUrl: sgeGouvImgUrl,
            alt: "République d'SGE",
            institution: "Ministère de l'Économie"
        },
        "homeLinkProps": {
            "href": "/",
            "title": "Accueil - Ministère de l'Économie de la République d'SGE"
        },
        "serviceTitle": "Guichet des entreprises",
        "quickAccessItems": [
            {
                "iconId": "fr-icon-mail-fill",
                "linkProps": {
                    href: "mailto:contact@example.com"
                },
                "text": "Contact us"
            },
            {
                "iconId": "ri-account-box-line",
                "text": "Se connecter",
                "buttonProps": {
                    "onClick": () => {
                        alert("TODO: implement login");
                    }
                }
            }
        ]
    },
    {
        "description": `If you need to create dynamic Header quick access items here is how you can do it, with a
\`AuthButton\` for example.

\`src/AuthButton.tsx\`

\`\`\`tsx
import { HeaderQuickAccessItem } from "@skygenesisenterprise/react-sds/Header";
import { declareComponentKeys, useTranslation } from "i18n"; // i18nifty
import { useOidc } from "oidc"; // oidc-spa

type Props = {
    // NOTE: If your component assigns an id you must use the one passed as prop.
    id?: string;
};

export function AuthButtons(props: Props) {
    const { id } = props;
    const { isUserLoggedIn, login, logout } = useOidc();
    const { t } = useTranslation("AuthButtons");

    if (!isUserLoggedIn) {
        return (
            <>
                <HeaderQuickAccessItem
                    id={\`login-\${id}\`}
                    quickAccessItem={{
                        iconId: "fr-icon-lock-line",
                        buttonProps: {
                            onClick: () => login({ doesCurrentHrefRequiresAuth: false })
                        },
                        text: t("login")
                    }}
                />
                <HeaderQuickAccessItem
                    id={\`register-\${id}\`}
                    quickAccessItem={{
                        iconId: "ri-id-card-line",
                        buttonProps: {
                            onClick: () =>
                                login({
                                    doesCurrentHrefRequiresAuth: false,
                                    transformUrlBeforeRedirect: url => {
                                        const urlObj = new URL(url);
                                        urlObj.pathname = urlObj.pathname.replace(/\\/auth$/, "/registrations");
                                        return urlObj.href;
                                    }
                                })
                        },
                        text: t("register")
                    }}
                />
            </>
        );
    }

    return (
        <>
            <HeaderQuickAccessItem
                id={\`account-\${id}\`}
                quickAccessItem={{
                    iconId: "fr-icon-account-fill",
                    linkProps: { to: "/account" },
                    text: t("my account")
                }}
            />
            <HeaderQuickAccessItem
                id={\`logout-\${id}\`}
                quickAccessItem={{
                    iconId: "ri-logout-box-line",
                    buttonProps: {
                        onClick: () => logout({ redirectTo: "home" })
                    },
                    text: t("logout")
                }}
            />
        </>
    );
}

const { i18n } = declareComponentKeys<"login" | "register" | "logout" | "my account">()(
    "AuthButtons"
);

export type I18n = typeof i18n;
\`\`\``
    }
);

export const WithUncontrolledSearchBar = getStory(
    {
        "identity": {
            imgUrl: sgeGouvImgUrl,
            alt: "République d'SGE",
            institution: "Gouvernement"
        },
        "homeLinkProps": {
            "href": "/",
            "title": "Accueil - Gouvernement de la République d'SGE"
        },
        "serviceTitle": "Portail d'information",
        "onSearchButtonClick": text => alert(`TODO: implement search with text: ${text}`),
        "clearSearchInputOnSearch": true,
        "allowEmptySearch": true
    },
    {
        "description": `
If you do not plan to provide any realtime hinting to the user as he types the search query you can provide an
\`onSearchButtonClick\` callback that will be called when the user clicks on the search button or presses enter.

You can also use the \`clearSearchInputOnSearch\` and \`allowEmptySearch\` props to control the behavior of the search input.

> NOTE: There is a bug in the underlying stylesheet that prevents the input from being cleared when the user presses
> the escape key. We hope it will be fixed soon.

\`\`\`tsx
<Header
    // identity, navigation...
    onSearchButtonClick={text => alert(\`TODO: implement search with text: \${text}\`)}
/>
\`\`\``
    }
);

type MySearchInputProps = {
    className?: string;
    id: string;
    placeholder: string;
    type: "search";
};

function MySearchInput(props: MySearchInputProps) {
    const { className, id, placeholder, type } = props;

    const [search, onSearchChange] = useState("");
    const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

    return (
        <>
            <input
                ref={setInputElement}
                className={className}
                id={id}
                placeholder={placeholder}
                type={type}
                value={search}
                onChange={event => onSearchChange(event.currentTarget.value)}
                onKeyDown={event => {
                    if (event.key === "Escape") {
                        onSearchChange("");
                        inputElement?.blur();
                    }
                }}
            />
            <p
                style={{
                    "position": "absolute",
                    "top": 81,
                    "left": 0
                }}
            >
                Search results for: {search}
            </p>
        </>
    );
}

export const WithControlledSearchBar = getStory(
    {
        "identity": {
            imgUrl: sgeGouvImgUrl,
            alt: "République d'SGE",
            institution: "Gouvernement"
        },
        "homeLinkProps": {
            "href": "/",
            "title": "Accueil - Gouvernement de la République d'SGE"
        },
        "serviceTitle": "Portail d'information",
        "renderSearchInput": ({ className, id, placeholder, type }) => (
            <MySearchInput className={className} id={id} placeholder={placeholder} type={type} />
        )
    },
    {
        "description": `
If you want to feature a modern search experience with realtime hinting you can omit providing an \`onSearchButtonClick\`
callback and instead make sure you provide an overlay with the search results in the \`renderSearchInput\` function.
As no component is provided to help you with that yet, you are on your own for implementing the overlay.

\`\`\`tsx
function Root() {
    const [search, onSearchChange] = useState("");

    return (
        <>
            <Header
                // identity, navigation...
                renderSearchInput={({ className, id, placeholder, type }) => (
                    <input
                        className={className}
                        id={id}
                        placeholder={placeholder}
                        type={type}
                        value={search}
                        onChange={event => onSearchChange(event.currentTarget.value)}
                    />
                )}
            />
            <p>Search results for: {search}</p>
        </>
    );
}
\`\`\``
    }
);

export const NavigationAsCustomNode = getStory(
    {
        "identity": {
            imgUrl: sgeGouvImgUrl,
            alt: "République d'SGE",
            institution: "Gouvernement"
        },
        "homeLinkProps": {
            "href": "/",
            "title": "Accueil - Gouvernement de la République d'SGE"
        },
        "navigation": (
            <MainNavigation
                items={[
                    {
                        "text": "accès direct",
                        "linkProps": {
                            "href": "#",
                            "target": "_self"
                        }
                    },
                    {
                        "text": "accès direct",
                        "linkProps": {
                            "href": "#",
                            "target": "_self"
                        },
                        "isActive": true
                    },
                    {
                        "text": "accès direct",
                        "linkProps": {
                            "href": "#",
                            "target": "_self"
                        }
                    },
                    {
                        "text": "accès direct",
                        "linkProps": {
                            "href": "#",
                            "target": "_self"
                        }
                    }
                ]}
            />
        )
    },
    {
        "description": `You can provide a custom \`ReactNode\` as the \`navigation\` prop.
It is useful to keep the Header as a server component in Next 13 AppDir.

\`\`\`tsx
import { MainNavigation } from "@skygenesisenterprise/react-sds/MainNavigation";

<Header
    identity={identity}
    navigation={
        <MainNavigation
            items={[
                // ...
            ]}
        />
    }
/>
\`\`\``
    }
);

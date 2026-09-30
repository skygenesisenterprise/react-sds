import React, { useState } from "react";
import { LanguageSelect as LanguageSelect_base } from "../dist/LanguageSelect";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { Header } from "../dist/Header";
import "./utils.css";
import sgeGouvImgUrl from "../src/assets/sge-gouv.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { "LanguageSelect": Story },
    "description": `
- [See source code](https://github.com/skygenesisenterprise/react-sds/blob/main/src/Header/LanguageSelect.tsx)  
  


\`src/Header.tsx\`  

\`\`\`tsx  

import { Header as SdsHeader } from "@skygenesisenterprise/react-sds/Header";
import { LanguageSelect } from "./LanguageSelect";

export function Header() {
    return (
        <SdsHeader
            quickAccessItems={[
                <LanguageSelect />
            ]}
        />
    );
}
\`\`\`  


\`src/LanguageSelect.tsx\`  

\`\`\`tsx

import { 
    LanguageSelect as LanguageSelect_base, 
    addLanguageSelectTranslations 
} from "@skygenesisenterprise/react-sds/LanguageSelect";
import { useLang, languages } from "i18n"; // i18nifty

type Props = {
    id?: string;
};

// NOTE: This component can be used inside or outside of the Header component.
export function LanguageSelect(props: Props) {

    const { id } = props;

    const { lang, setLang } = useLang();

    return (
        <LanguageSelect_base
            id={id}
            supportedLangs={languages} // ["en", "fr"]
            lang={lang} // "en" or "fr"
            setLang={setLang}
            fullNameByLang={{
                en: "English",
                fr: "Français"
            }}
        />
    );

}

languages.forEach(lang =>
    addLanguageSelectTranslations({
        lang: lang,
        messages: {
            "select language": (() => {
                switch (lang) {
                    case "en": return "Select language";
                    /* spell-checker: disable */
                    case "fr": return "Choisir la langue";
                    /* spell-checker: enable */
                }
            })()
        }
    })
);
\`\`\`



`,
    "disabledProps": ["lang"]
});

export default meta;

export const SimpleHeader = getStory({});

const identity = {
    imgUrl: sgeGouvImgUrl,
    alt: "République d'SGE",
    institution: "Gouvernement"
};

const homeLinkProps = {
    "href": "#",
    "title": "Accueil - Gouvernement de la République d'SGE"
};

type Language = "fr" | "en";

function LanguageSelect(props: { id?: string }) {
    const { id } = props;

    const [lang, setLang] = useState<Language>("en");

    return (
        <LanguageSelect_base
            id={id}
            supportedLangs={["fr", "en"]}
            fullNameByLang={{
                "fr": "Français",
                "en": "English"
            }}
            lang={lang}
            setLang={setLang}
        />
    );
}

function Story() {
    return (
        <Header
            className="margin-bottom-50px"
            identity={identity}
            homeLinkProps={homeLinkProps}
            quickAccessItems={[<LanguageSelect />]}
        />
    );
}

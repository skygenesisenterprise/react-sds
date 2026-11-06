import * as React from "react";
import { fr } from "../dist";
import { Header } from "../dist/Header";
import { Footer } from "../dist/Footer";
import { headerFooterDisplayItem } from "../dist/Display";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import sgeIdentityImgUrl from "../src/assets/sge-identity.svg";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { "Display": Story },
    "description": `
A button that opens a dialog to enable the user to select light or dark mode.  

- [See source code](https://github.com/skygenesisenterprise/react-sds/blob/main/src/Display/Display.tsx)

Optionally, you can also use \`import { useIsDark } from "@skygenesisenterprise/react-sds"\` to manually monitor and controls 
the theme state.

## Usage example 

\`\`\`tsx
import { Header } from "@skygenesisenterprise/react-sds/Header";
import { Footer } from "@skygenesisenterprise/react-sds/Footer";
import { headerFooterDisplayItem } from "@skygenesisenterprise/react-sds/Display";

function App(){

    return (
        <>
            <Header
                // other Header props...
                quickAccessItems={[
                    // other quick access items...
                    headerFooterDisplayItem
                ]}
            >
            {/* ... your app ...*/}
            <Footer
                // other Footer props...
                bottomItems={[
                    // other other bottom items...
                    headerFooterDisplayItem
                ]}
            />
        <>
    );

}
\`\`\`
`,
    "disabledProps": ["darkMode", "containerWidth"]
});

export default meta;

const identity = {
    imgUrl: sgeIdentityImgUrl,
    alt: "Sky Genesis Enterprise",
    institution: "Sky Genesis Enterprise"
};

const homeLinkProps = {
    "href": "#",
    "title": "Accueil - Sky Genesis Enterprise"
};

function Story() {
    return (
        <>
            <Header
                identity={identity}
                serviceTitle="Nom du site / service"
                homeLinkProps={homeLinkProps}
                quickAccessItems={[headerFooterDisplayItem]}
            />
            <Footer
                className={fr.cx("fr-mt-5v")}
                identity={identity}
                homeLinkProps={homeLinkProps}
                accessibility="fully compliant"
                bottomItems={[headerFooterDisplayItem]}
            />
        </>
    );
}

export const Default = getStory({});

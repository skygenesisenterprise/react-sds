import React from "react";
import { Quote } from "../dist/Quote";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import placeholder_1x1ImgUrl from "./assets/placeholder.1x1.svg";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Quote },
    "description": `
- [See source code](https://github.com/skygenesisenterprise/react-sds/blob/main/src/Quote.tsx)`,
    "disabledProps": ["lang"]
});

export default meta;

export const Default = getStory({
    text: "Lorem [...] elit ut. ",
    author: "Auteur",
    source: (
        <>
            <li>
                <cite>Ouvrage</cite>
            </li>
            <li>Détail 1</li>
            <li>Détail 2</li>
            <li>Détail 3</li>
            <li>
                <a
                    target="_blank"
                    href="[À MODIFIER | Lien vers la sources ou des infos complémentaires]"
                >
                    Détail 4
                </a>
            </li>
        </>
    ),
    imageUrl: placeholder_1x1ImgUrl,
    size: "xlarge",
    className: ""
});

export const QuoteMediumAndAccent = getStory({
    text: "Lorem [...] elit ut. ",
    author: "Auteur",
    source: (
        <>
            <li>
                <cite>Ouvrage</cite>
            </li>
            <li>Détail 1</li>
            <li>Détail 2</li>
            <li>Détail 3</li>
            <li>
                <a
                    target="_blank"
                    href="[À MODIFIER | Lien vers la sources ou des infos complémentaires]"
                >
                    Détail 4
                </a>
            </li>
        </>
    ),
    imageUrl: placeholder_1x1ImgUrl,
    size: "medium",
    accentColor: "pink-macaron"
});

export const QuoteWithoutDetails = getStory({
    text: "Lorem [...] elit ut. ",
    author: "Auteur",
    imageUrl: placeholder_1x1ImgUrl
});

export const QuoteWithoutSource = getStory({
    text: "Lorem [...] elit ut. ",
    imageUrl: placeholder_1x1ImgUrl
});

export const QuoteWithoutIllustration = getStory({
    text: "Lorem [...] elit ut. ",
    author: "Auteur",
    source: (
        <>
            <li>
                <cite>Ouvrage</cite>
            </li>
            <li>Détail 1</li>
            <li>Détail 2</li>
            <li>Détail 3</li>
            <li>
                <a
                    target="_blank"
                    href="[À MODIFIER | Lien vers la sources ou des infos complémentaires]"
                >
                    Détail 4
                </a>
            </li>
        </>
    )
});

export const QuoteWithAccent = getStory({
    text: "Lorem [...] elit ut. ",
    imageUrl: placeholder_1x1ImgUrl,
    accentColor: "yellow-moutarde",
    author: "Someone"
});

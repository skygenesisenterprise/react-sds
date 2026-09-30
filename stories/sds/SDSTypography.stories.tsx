import { SDSHeading, SDSText, SDSLead, SDSLink } from "../dist/sds/typography";
import { getStoryFactory } from "./getStory";

const sectionName = "SDS";

export default {};

const heading = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSHeading },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSHeadingStory = heading.getStory(
    {
        "level": 1,
        "children": "Ministère de la Défense"
    },
    { "description": "Titre sémantique : le tag (h1…h6) et la taille suivent le niveau." }
);

const text = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSText },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSTextStory = text.getStory(
    {
        "size": "lg",
        "weight": "semibold",
        "color": "muted",
        "children": "Un paragraphe typographiquement contrôlé."
    },
    { "description": "Texte contrôlé (taille, graisse, couleur, marge, alignement)." }
);

const lead = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSLead },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSLeadStory = lead.getStory(
    {
        "children": "Introduction d'un chapitre, plus grande et plus aérée pour la lisibilité."
    },
    { "description": "Paragraphe d'introduction de section." }
);

const link = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSLink },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSLinkStory = link.getStory(
    {
        "href": "#",
        "variant": "action",
        "iconId": "fr-icon-arrow-right-line",
        "children": "Accéder au service"
    },
    { "description": "Lien stylisé. `variant`: default (texte souligné), muted, action (avec icône)." }
);
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
} from "../dist/sds/content";
import { getStoryFactory } from "./getStory";

const sectionName = "SDS";

export default {};

const card = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSCard },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSCardStory = card.getStory(
    {
        "href": "#",
        "tag": "Actualité",
        "title": "Rapport annuel 2026",
        "description": "Le rapport annuel du ministère est désormais en ligne.",
        "footer": <SDSLinkMock>En savoir plus</SDSLinkMock>
    },
    { "description": "Carte de base du gouvernement (titre, description, média, tag, pied)." }
);

const teaser = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSTeaserCard },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSTeaserCardStory = teaser.getStory(
    {
        "href": "#",
        "tag": "Démarche",
        "title": "Demander une bourse",
        "description": "Toutes les informations pour constituer votre dossier."
    },
    { "description": "Carte teaser compacte avec appel à l'action." }
);

const article = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSArticleCard },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSArticleCardStory = article.getStory(
    {
        "href": "#",
        "date": "12 janv. 2026",
        "title": "Une avancée majeure pour le numérique d'État",
        "description": "Présentation des nouvelles règles de sécurité applicatives."
    },
    { "description": "Carte d'article / actualité avec image, date et lien lire la suite." }
);

const newsList = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSNewsList },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSNewsListStory = newsList.getStory(
    {
        "horizontal": true,
        "items": [
            { "href": "#", "date": "12 janv. 2026", "title": "Actualité 1", "description": "Description." },
            { "href": "#", "date": "11 janv. 2026", "title": "Actualité 2", "description": "Description." },
            { "href": "#", "date": "10 janv. 2026", "title": "Actualité 3", "description": "Description." }
        ]
    },
    { "description": "Liste d'actualités, verticale ou en grille horizontale." }
);

const linkList = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSLinkList },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSLinkListStory = linkList.getStory(
    {
        "title": "Liens utiles",
        "items": [
            { "label": "Formulaires", "href": "#", "description": "Accès aux démarches" },
            { "label": "Contacts", "href": "#" },
            { "label": "Partenaires", "href": "#" }
        ]
    },
    { "description": "Liste de liens bordés avec descriptions optionnelles." }
);

const doc = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSDocument },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSDocumentStory = doc.getStory(
    {
        "href": "#",
        "title": "Rapport annuel 2026",
        "fileType": "PDF",
        "fileSize": "1,2 Mo",
        "date": "janv. 2026"
    },
    { "description": "Bloc document avec icône, métadonnées et action de téléchargement." }
);

const download = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSDownload },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSDownloadStory = download.getStory(
    {
        "href": "#",
        "label": "Télécharger le formulaire",
        "fileType": "PDF",
        "fileSize": "850 Ko"
    },
    { "description": "Lien de téléchargement avec icône et métadonnées." }
);

const event = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSEvent },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSEventStory = event.getStory(
    {
        "href": "#",
        "date": "2026-02-12",
        "title": "Conférence sur la cybersécurité",
        "time": "14h00",
        "location": "Paris"
    },
    { "description": "Événement d'agenda avec bloc date, heure et lieu." }
);

const meeting = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSMeetingCard },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSMeetingCardStory = meeting.getStory(
    {
        "href": "#",
        "date": "2026-03-01",
        "title": "Comité d'orientation",
        "time": "10h00",
        "location": "En ligne",
        "attendees": "25 inscrits"
    },
    { "description": "Carte de réunion (comité, consultation publique) avec ligne de participants." }
);

function SDSLinkMock({ children }: { children: React.ReactNode }) {
    return (
        <a href="#" className="sds-link sds-link--action">
            {children}
            <i className="fr-icon-arrow-right-line" aria-hidden="true" />
        </a>
    );
}
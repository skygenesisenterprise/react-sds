import {
    SDSGovernmentHeader,
    SDSMinistryHeader,
    SDSGovernmentFooter,
    SDSHero,
    SDSServiceBanner,
    SDSOfficialNotice,
    SDSBreadcrumb,
    SDSNavigation,
    SDSMegaMenu,
    SDSSearch,
    SDSPagination
} from "../dist/sds/portal";
import { getStoryFactory } from "./getStory";

const sectionName = "SDS";

export default {};

const header = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSGovernmentHeader },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSGovernmentHeaderStory = header.getStory(
    {
        "organization": "Ministère de la Défense",
        "children": <SDSNavigationMock />
    },
    { "description": "En-tête institutionnel collant avec identité et navigation." }
);

const ministry = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSMinistryHeader },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSMinistryHeaderStory = ministry.getStory(
    {
        "organization": "Ministère de la Justice"
    },
    { "description": "Bandeau ministère compact, pour les pages intérieures." }
);

const footer = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSGovernmentFooter },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSGovernmentFooterStory = footer.getStory(
    {
        "organization": "Ministère de la Défense",
        "columns": [
            { "title": "Le ministère", "links": [{ "label": "Présentation", "href": "#" }, { "label": "Organisation", "href": "#" }] },
            { "title": "Démarches", "links": [{ "label": "Formulaires", "href": "#" }] }
        ],
        "bottomLinks": [{ "label": "Mentions légales", "href": "#" }, { "label": "Confidentialité", "href": "#" }]
    },
    { "description": "Pied de page institutionnel avec colonnes de liens et barre inférieure." }
);

const hero = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSHero },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSHeroStory = hero.getStory(
    {
        "kicker": "Portail officiel",
        "title": "Ministère de la Défense",
        "subtitle": "La défense de la République d'SGE.",
        "actions": <button>Découvrir</button>
    },
    { "description": "Bannière héro avec sur-titre, titre, sous-titre et actions." }
);

const banner = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSServiceBanner },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSServiceBannerStory = banner.getStory(
    {
        "tone": "warning",
        "title": "Maintenance",
        "children": "Le service sera indisponible de 22h à 2h."
    },
    { "description": "Bannière d'état du service (info, succès, avertissement, danger)." }
);

const notice = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSOfficialNotice },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSOfficialNoticeStory = notice.getStory(
    {
        "children": "République d'SGE — site officiel"
    },
    { "description": "Bandeau de mention officielle." }
);

const breadcrumb = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSBreadcrumb },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSBreadcrumbStory = breadcrumb.getStory(
    {
        "items": [
            { "label": "Accueil", "href": "#" },
            { "label": "Services", "href": "#" },
            { "label": "Page actuelle" }
        ]
    },
    { "description": "Fil d'Ariane sémantique (dernier élément = page courante)." }
);

const nav = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSNavigation },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSNavigationStory = nav.getStory(
    {
        "items": [
            { "label": "Accueil", "href": "#", "active": true },
            { "label": "Démarches", "href": "#" },
            { "label": "Actualités", "href": "#" }
        ]
    },
    { "description": "Barre de navigation horizontale, élément actif marqué." }
);

const megaMenu = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSMegaMenu },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSMegaMenuStory = megaMenu.getStory(
    {
        "label": "Démarches",
        "columns": [
            { "title": "Scolarité", "links": [{ "label": "Bourses", "href": "#" }, { "label": "Inscription", "href": "#" }] },
            { "title": "Emploi", "links": [{ "label": "Offres", "href": "#" }] }
        ]
    },
    { "description": "Menu déroulant large accessible au clavier (Enter/Échap), replié en statique sur mobile." }
);

const search = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSSearch },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSSearchStory = search.getStory(
    {
        "placeholder": "Rechercher une démarche"
    },
    { "description": "Formulaire de recherche accessible (champ + bouton)." }
);

const pagination = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSPagination },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSPaginationStory = pagination.getStory(
    {
        "currentPage": 5,
        "pageCount": 12
    },
    { "description": "Pagination avec numéros, ellipses et contrôles précédent/suivant." }
);

function SDSNavigationMock() {
    return (
        <nav aria-label="Navigation principale">
            <a href="#" style={{ "marginInline": "0.5rem" }}>Accueil</a>
            <a href="#" style={{ "marginInline": "0.5rem" }}>Démarches</a>
            <a href="#" style={{ "marginInline": "0.5rem" }}>Actualités</a>
        </nav>
    );
}
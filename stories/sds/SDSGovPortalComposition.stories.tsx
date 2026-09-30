import {
    SDSPortal,
    SDSGovernmentHeader,
    SDSGovernmentFooter,
    SDSHero,
    SDSServiceBanner,
    SDSOfficialNotice,
    SDSBreadcrumb,
    SDSNavigation,
    SDSSearch,
    SDSPagination
} from "../dist/sds/portal";
import {
    SDSPage,
    SDSMain,
    SDSContainer,
    SDSSection,
    SDSStack,
    SDSGrid
} from "../dist/sds/layout";
import { SDSLead } from "../dist/sds/typography";
import {
    SDSTeaserCard,
    SDSNewsList,
    SDSLinkList,
    SDSDocument,
    SDSDownload,
    SDSEvent
} from "../dist/sds/content";
import { getStoryFactory } from "./getStory";

const sectionName = "SDS";

/**
 * Page de portail gouvernemental construite **uniquement** avec des composants SDS.
 *
 * Aucun CSS local, aucun `CSSProperties` massif : l'application décrit le contenu et
 * la structure, SDS décide de la présentation. Cette page illustre le critère de
 * réussite principal de la mission.
 */
const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSPortal },
    "disabledProps": ["lang", "darkMode"]
});

export default meta;

export const PortailGouvernemental = getStory(
    {
        "organization": "Ministère de la Défense",
        "children": (
            <>
                <SDSOfficialNotice>République d'SGE — site officiel</SDSOfficialNotice>

                <SDSGovernmentHeader organization="Ministère de la Défense">
                    <SDSNavigation
                        items={[
                            { "label": "Accueil", "href": "#", "active": true },
                            { "label": "Démarches", "href": "#" },
                            { "label": "Actualités", "href": "#" },
                            { "label": "Carrières", "href": "#" }
                        ]}
                    />
                </SDSGovernmentHeader>

                <SDSPage>
                    <SDSMain>
                        <SDSHero
                            kicker="Portail officiel"
                            title="Ministère de la Défense"
                            subtitle="Assurer la défense et la sécurité de la République d'SGE."
                            actions={<button>Découvrir nos missions</button>}
                        />

                        <SDSContainer>
                            <SDSStack gap="8">
                                <SDSBreadcrumb
                                    items={[
                                        { "label": "Accueil", "href": "#" },
                                        { "label": "Page actuelle" }
                                    ]}
                                />

                                <SDSServiceBanner tone="info">
                                    Les formulaires de demande sont en cours de mise à jour.
                                </SDSServiceBanner>

                                <SDSSearch placeholder="Rechercher une démarche" />

                                <SDSSection title="Démarches" subtitle="Accéder aux principaux services en ligne">
                                    <SDSGrid columns={{ "mobile": 1, "tablet": 2, "desktop": 3 }} gap="6">
                                        <SDSTeaserCard
                                            href="#"
                                            tag="Démarche"
                                            title="Demander une bourse"
                                            description="Constituer votre dossier de demande."
                                        />
                                        <SDSTeaserCard
                                            href="#"
                                            tag="Démarche"
                                            title="S'inscrire au service national"
                                            description="Toutes les informations pratiques."
                                        />
                                        <SDSTeaserCard
                                            href="#"
                                            tag="Démarche"
                                            title="Accéder à son dossier militaire"
                                            description="Suivez votre carrière en ligne."
                                        />
                                    </SDSGrid>
                                </SDSSection>

                                <SDSSection title="Actualités">
                                    <SDSLead>
                                        Les dernières publications du ministère et les communiqués
                                        officiels.
                                    </SDSLead>
                                    <SDSNewsList
                                        horizontal
                                        items={[
                                            {
                                                "href": "#",
                                                "date": "12 janv. 2026",
                                                "title": "Rapport annuel 2026 publié",
                                                "description": "Le rapport annuel du ministère est en ligne."
                                            },
                                            {
                                                "href": "#",
                                                "date": "10 janv. 2026",
                                                "title": "Nouvelle base de données",
                                                "description": "Accès aux données ouvertes de la défense."
                                            },
                                            {
                                                "href": "#",
                                                "date": "8 janv. 2026",
                                                "title": "Campagne de recrutement",
                                                "description": "Le ministère recrute des ingénieurs."
                                            }
                                        ]}
                                    />
                                </SDSSection>

                                <SDSSection title="Documents & publications">
                                    <SDSGrid columns={{ "mobile": 1, "desktop": 2 }} gap="5">
                                        <SDSDocument
                                            href="#"
                                            title="Rapport annuel 2026"
                                            fileType="PDF"
                                            fileSize="1,2 Mo"
                                            date="janv. 2026"
                                        />
                                        <SDSDownload
                                            href="#"
                                            label="Télécharger le formulaire de demande"
                                            fileType="PDF"
                                            fileSize="850 Ko"
                                        />
                                    </SDSGrid>
                                </SDSSection>

                                <SDSSection title="Agenda">
                                    <SDSGrid columns={{ "mobile": 1, "desktop": 2 }} gap="5">
                                        <SDSEvent
                                            href="#"
                                            date="2026-02-12"
                                            title="Conférence cybersécurité"
                                            time="14h00"
                                            location="Paris"
                                        />
                                        <SDSEvent
                                            href="#"
                                            date="2026-03-01"
                                            title="Comité d'orientation"
                                            time="10h00"
                                            location="En ligne"
                                        />
                                    </SDSGrid>
                                </SDSSection>

                                <SDSSection title="Liens utiles">
                                    <SDSLinkList
                                        items={[
                                            { "label": "Formulaires", "href": "#" },
                                            { "label": "Contacts", "href": "#" },
                                            { "label": "Partenaires", "href": "#" }
                                        ]}
                                    />
                                </SDSSection>

                                <SDSPagination currentPage={5} pageCount={12} />
                            </SDSStack>
                        </SDSContainer>
                    </SDSMain>
                </SDSPage>

                <SDSGovernmentFooter
                    organization="Ministère de la Défense"
                    columns={[
                        {
                            "title": "Le ministère",
                            "links": [
                                { "label": "Présentation", "href": "#" },
                                { "label": "Organisation", "href": "#" },
                                { "label": "Budget", "href": "#" }
                            ]
                        },
                        {
                            "title": "Démarches",
                            "links": [
                                { "label": "Formulaires", "href": "#" },
                                { "label": "Recrutement", "href": "#" }
                            ]
                        },
                        {
                            "title": "Contact",
                            "links": [
                                { "label": "Nous contacter", "href": "#" },
                                { "label": "Presse", "href": "#" }
                            ]
                        }
                    ]}
                    bottomLinks={[
                        { "label": "Mentions légales", "href": "#" },
                        { "label": "Confidentialité", "href": "#" },
                        { "label": "Accessibilité", "href": "#" }
                    ]}
                />
            </>
        )
    },
    {
        "description":
            "Page complète de portail gouvernemental composée exclusivement de composants SDS — aucun CSS local, aucune propriété de style inline : l'application décrit le contenu, SDS gère la présentation."
    }
);
import { SDSPage, SDSMain, SDSContainer, SDSSection, SDSStack, SDSGrid, SDSColumns } from "../dist/sds/layout";
import { getStoryFactory } from "./getStory";

const sectionName = "SDS";

export default {};

const page = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSPage },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSPageStory = page.getStory(
    {
        "children": (
            <SDSStack gap="4">
                <SDSGovernmentHeaderMock />
                <SDSMain>
                    <SDSContainer>
                        <p>Contenu de la page.</p>
                    </SDSContainer>
                </SDSMain>
                <SDSGovernmentFooterMock />
            </SDSStack>
        )
    },
    { "description": "Coquille pleine hauteur d'une page : colonne flex avec contenu qui pousse le footer en bas." }
);

const container = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSContainer },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSContainerStory = container.getStory(
    {
        "size": "wide",
        "children": (
            <div style={{ "backgroundColor": "var(--sds-color-surface-muted)", "padding": "1rem" }}>
                Contenu dans un conteneur centré et borné en largeur.
            </div>
        )
    },
    { "description": "Colonne centrée et bornée en largeur. `size` : default (75rem), wide (80rem), narrow (52rem)." }
);

const section = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSSection },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSSectionStory = section.getStory(
    {
        "title": "Actualités",
        "subtitle": "Les dernières publications du ministère.",
        "action": <button>Voir tout</button>,
        "children": "Contenu de la section."
    },
    { "description": "Section verticale avec en-tête (titre + sous-titre + action) et fond optionnel." }
);

const stack = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSStack },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSStackStory = stack.getStory(
    {
        "gap": 6,
        "children": (
            <>
                <div>Bloc A</div>
                <div>Bloc B</div>
                <div>Bloc C</div>
            </>
        )
    },
    { "description": "Pile verticale avec un espacement constant entre les blocs." }
);

const grid = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSGrid },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSGridStory = grid.getStory(
    {
        "columns": { "mobile": 1, "tablet": 2, "desktop": 3 },
        "gap": 6,
        "children": (
            <>
                <div>1</div>
                <div>2</div>
                <div>3</div>
            </>
        )
    },
    { "description": "Grille responsive : colonnes par breakpoint (mobile / tablette / desktop)." }
);

const columns = getStoryFactory({
    sectionName,
    "wrappedComponent": { SDSColumns },
    "disabledProps": ["lang", "darkMode"]
});
export const SDSColumnsStory = columns.getStory(
    {
        "cols": 3,
        "gap": 6,
        "children": (
            <>
                <div>Colonne 1</div>
                <div>Colonne 2</div>
                <div>Colonne 3</div>
            </>
        )
    },
    { "description": "Colonnes de largeur égale qui passent en pleine largeur sur mobile." }
);

function SDSGovernmentHeaderMock() {
    return <header style={{ "borderBottom": "1px solid var(--sds-color-border)", "padding": "1rem" }}>En-tête</header>;
}
function SDSGovernmentFooterMock() {
    return <footer style={{ "borderTop": "1px solid var(--sds-color-border)", "padding": "1rem" }}>Pied de page</footer>;
}
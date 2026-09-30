/* eslint-disable no-inner-declarations */
import type { JSX } from "../tools/JSX";
import React, {
    memo,
    forwardRef,
    cloneElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
    type CSSProperties,
    type ComponentProps
} from "react";
import { fr } from "../fr";
import { createComponentI18nApi } from "../i18n";
import { symToStr } from "tsafe/symToStr";
import { cx } from "../tools/cx";
import { getLink } from "../link";
import type { RegisteredLinkProps } from "../link";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { FrIconClassName, RiIconClassName } from "../fr/generatedFromCss/classNames";
import type { MainNavigationProps } from "../MainNavigation";
import { HeaderNavigation } from "./HeaderNavigation";
import { Display } from "../Display/Display";
import { setIdentityAndHomeLinkProps } from "../zz_internal/identityAndHomeLinkProps";
import "../assets/sge-identity.css";
import { typeGuard } from "tsafe/typeGuard";
import { SearchButton } from "../SearchBar/SearchButton";
import { useTranslation as useSearchBarTranslation } from "../SearchBar/SearchBar";

export type HeaderProps = {
    className?: string;
    id?: string;
    /**
     * The institutional signature of the site: the national mark of the Sky Genesis Enterprise
     * (official flag/emblem lockup) and the administrative authority the site belongs to.
     *
     * ```txt
     *  🇦🇴  République d'SGE        ← identity.imgUrl (the lockup includes the name of the Republic)
     *      Gouvernement                ← identity.institution
     * ```
     */
    identity: HeaderProps.Identity;
    homeLinkProps: RegisteredLinkProps & { title: string };
    serviceTitle?: ReactNode;
    serviceTagline?: ReactNode;
    navigation?: MainNavigationProps.Item[] | ReactNode;
    /** There should be at most three of them */
    quickAccessItems?: (HeaderProps.QuickAccessItem | JSX.Element | null)[];
    renderSearchInput?: (
        /**
         * id and name must be forwarded to the <input /> component
         * the others params can, but it's not mandatory.
         **/
        params: {
            id: string;
            type: "search";
            className: string;
            placeholder: string;
        }
    ) => JSX.Element;
    /** Called when the search button is clicked */
    onSearchButtonClick?: (text: string) => void;
    /** Default: false */
    clearSearchInputOnSearch?: boolean;
    /** Default: false */
    allowEmptySearch?: boolean;
    classes?: Partial<
        Record<
            | "root"
            | "body"
            | "container"
            | "bodyRow"
            | "brand"
            | "brandTop"
            | "logo"
            | "identity"
            | "identityImg"
            | "institution"
            | "navbar"
            | "service"
            | "serviceTitle"
            | "serviceTagline"
            | "toolsLinks"
            | "menu"
            | "menuLinks",
            string
        >
    >;
    style?: CSSProperties;
    /** Default: false */
    disableDisplay?: boolean;
};

export namespace HeaderProps {
    export type Identity = {
        /**
         * URL of the official SGE mark. It must feature the national flag/emblem and the
         * "République d'SGE" wordmark (SVG preferred, no emoji flag).
         */
        imgUrl: string;
        /**
         * Accessible alternative of the image. As the image contains the name of the Republic,
         * the alt text should name it (e.g. "République d'SGE").
         */
        alt: string;
        /**
         * Administrative authority hosting the site, displayed under the identity as the second
         * level of the institutional hierarchy: "Gouvernement", "Ministère de l'Économie", …
         */
        institution: string;
    };

    export type QuickAccessItem = QuickAccessItem.Link | QuickAccessItem.Button;

    export namespace QuickAccessItem {
        export type Common = {
            iconId: FrIconClassName | RiIconClassName;
            text: ReactNode;
        };

        export type Link = Common & {
            linkProps: RegisteredLinkProps;
            buttonProps?: never;
        };

        export type Button = Common & {
            linkProps?: never;
            buttonProps: ComponentProps<"button"> &
                Record<`data-${string}`, string | boolean | null | undefined>;
        };
    }
}

export const headerMenuModalIdPrefix = "header-menu-modal";

/**
 * Menu open state of the closest `<Header />`.
 *
 * Used by the legacy `useIsHeaderMenuModalOpen` hook. The header no longer relies on a
 * DSFR modal to render its collapsed menu, so the state is shared through React context
 * instead of DOM events.
 */
export const HeaderMenuContext = React.createContext<
    { isOpen: boolean; setIsOpen: (isOpen: boolean) => void } | undefined
>(undefined);

/** @see <https://skygenesisenterprise.github.io/react-sds/?path=/docs/components-header> */
export const Header = memo(
    forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
        const {
            className,
            id: id_props,
            identity,
            serviceTitle,
            serviceTagline,
            homeLinkProps,
            navigation = undefined,
            quickAccessItems = [],
            renderSearchInput,
            clearSearchInputOnSearch = false,
            allowEmptySearch = false,
            onSearchButtonClick,
            classes = {},
            style,
            disableDisplay = false,
            ...rest
        } = props;

        assert<Equals<keyof typeof rest, never>>();

        const id = id_props ?? "sds-header";

        const menuModalId = `${headerMenuModalIdPrefix}-${id}`;
        const menuButtonId = `${id}-menu-button`;
        const searchModalId = `${id}-search-modal`;
        const searchInputId = `${id}-search-input`;
        const searchLabelId = `${id}-search-label`;

        const isSearchBarEnabled =
            renderSearchInput !== undefined || onSearchButtonClick !== undefined;

        const isCollapsible =
            navigation !== undefined || quickAccessItems.length > 0 || isSearchBarEnabled;

        setIdentityAndHomeLinkProps({ identity, homeLinkProps });

        const { t } = useTranslation();
        const { t: tSearchBar } = useSearchBarTranslation();

        const { Link } = getLink();

        const [isMenuOpen, setIsMenuOpen] = useState(false);

        const menuButtonRef = useRef<HTMLButtonElement>(null);
        const panelCloseButtonRef = useRef<HTMLButtonElement>(null);
        const hasBeenOpenedRef = useRef(false);

        const closeMenu = useCallback(() => setIsMenuOpen(false), []);

        // Move focus into the collapsed panel when it opens, close it with Escape, and
        // give focus back to the trigger when it closes. The panel is only rendered as a
        // dialog on small screens (see header.css); this is harmless on desktop.
        useEffect(() => {
            if (!isMenuOpen) {
                if (hasBeenOpenedRef.current) {
                    hasBeenOpenedRef.current = false;
                    menuButtonRef.current?.focus();
                }
                return;
            }

            hasBeenOpenedRef.current = true;

            panelCloseButtonRef.current?.focus();

            const onKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    closeMenu();
                }
            };

            document.addEventListener("keydown", onKeyDown);

            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            return () => {
                document.removeEventListener("keydown", onKeyDown);
                document.body.style.overflow = previousOverflow;
            };
        }, [isMenuOpen, closeMenu]);

        const menuContextValue = useMemo(
            () => ({ isOpen: isMenuOpen, setIsOpen: setIsMenuOpen }),
            [isMenuOpen]
        );

        const quickAccessNodes = quickAccessItems.map((quickAccessItem, i) => {
            const node = !typeGuard<HeaderProps.QuickAccessItem>(
                quickAccessItem,
                quickAccessItem instanceof Object && "text" in quickAccessItem
            ) ? (
                quickAccessItem
            ) : (
                <HeaderQuickAccessItem quickAccessItem={quickAccessItem} />
            );

            if (node === null) {
                return null;
            }

            return (
                <li key={i} className="sds-header__actions-item">
                    {cloneElement(node, { "id": `${id}-quick-access-item-${i}` })}
                </li>
            );
        });

        return (
            <>
                {!disableDisplay && <Display />}
                <HeaderMenuContext.Provider value={menuContextValue}>
                    <header
                        role="banner"
                        id={id}
                        className={cx("sds-header", classes.root, className)}
                        ref={ref}
                        style={style}
                        {...rest}
                    >
                        <div
                            className={cx(
                                "sds-header__inner",
                                classes.body,
                                classes.container,
                                classes.bodyRow
                            )}
                        >
                            {/* [organisation] */}
                            <div className={cx("sds-header__organisation", classes.brand)}>
                                <Link
                                    {...homeLinkProps}
                                    className={cx(
                                        "sds-header__brand sds-identity__link",
                                        classes.logo,
                                        classes.identity,
                                        classes.brandTop
                                    )}
                                >
                                    <img
                                        className={cx(
                                            "sds-identity__img",
                                            classes.identityImg
                                        )}
                                        src={identity.imgUrl}
                                        alt={identity.alt}
                                    />
                                    <span
                                        className={cx(
                                            "sds-identity__institution",
                                            classes.institution
                                        )}
                                    >
                                        {identity.institution}
                                    </span>
                                </Link>

                                {serviceTitle !== undefined && (
                                    <div className={cx("sds-header__service", classes.service)}>
                                        <Link
                                            {...homeLinkProps}
                                            className="sds-header__service-link"
                                        >
                                            <p
                                                className={cx(
                                                    "sds-header__service-title",
                                                    classes.serviceTitle
                                                )}
                                            >
                                                {serviceTitle}
                                            </p>
                                        </Link>
                                        {serviceTagline !== undefined && (
                                            <p
                                                className={cx(
                                                    "sds-header__service-tagline",
                                                    classes.serviceTagline
                                                )}
                                            >
                                                {serviceTagline}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* [navigation] + [action] — inline on desktop, panel on mobile */}
                            <div
                                id={menuModalId}
                                className={cx("sds-header__panel", classes.menu)}
                                data-open={isMenuOpen ? "" : undefined}
                                role={isMenuOpen ? "dialog" : undefined}
                                aria-modal={isMenuOpen ? true : undefined}
                                aria-label={t("menu")}
                            >
                                <button
                                    ref={panelCloseButtonRef}
                                    type="button"
                                    className="sds-header__panel-close"
                                    onClick={closeMenu}
                                    title={t("close")}
                                >
                                    <span className="sds-header__sr-only">{t("close")}</span>
                                </button>

                                {navigation !== undefined && (
                                    <div
                                        className={cx(
                                            "sds-header__navigation",
                                            classes.menuLinks
                                        )}
                                    >
                                        {navigation instanceof Array ? (
                                            <HeaderNavigation
                                                id={`${id}-main-navigation`}
                                                items={navigation}
                                            />
                                        ) : (
                                            navigation
                                        )}
                                    </div>
                                )}

                                <div className={cx("sds-header__actions", classes.navbar)}>
                                    {quickAccessItems.length > 0 && (
                                        <ul
                                            className={cx(
                                                "sds-header__actions-list",
                                                classes.toolsLinks
                                            )}
                                        >
                                            {quickAccessNodes}
                                        </ul>
                                    )}

                                    {isSearchBarEnabled && (
                                        <button
                                            id={`${id}-search-button`}
                                            type="button"
                                            className="sds-header__action sds-header__search-button"
                                            data-fr-opened={false}
                                            aria-controls={searchModalId}
                                            title={tSearchBar("label")}
                                        >
                                            <span
                                                className="sds-header__search-icon"
                                                aria-hidden="true"
                                            />
                                            <span className="sds-header__sr-only">
                                                {tSearchBar("label")}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Mobile menu trigger */}
                            {isCollapsible && (
                                <button
                                    ref={menuButtonRef}
                                    id={menuButtonId}
                                    type="button"
                                    className="sds-header__menu-button"
                                    aria-expanded={isMenuOpen}
                                    aria-controls={menuModalId}
                                    title={t("menu")}
                                    onClick={() => setIsMenuOpen(isOpen => !isOpen)}
                                >
                                    <span
                                        className="sds-header__menu-icon"
                                        aria-hidden="true"
                                    />
                                    <span className="sds-header__sr-only">{t("menu")}</span>
                                </button>
                            )}
                        </div>

                        {/* Search — kept as a DSFR-free modal dialog opened from the actions. */}
                        {isSearchBarEnabled && (
                            <div
                                className={fr.cx("fr-header__search", "fr-modal")}
                                id={searchModalId}
                                aria-labelledby={`${id}-search-bar-button`}
                            >
                                <div
                                    className={fr.cx(
                                        "fr-container",
                                        "fr-container-lg--fluid"
                                    )}
                                >
                                    <button
                                        id={`${id}-search-close-button`}
                                        className={fr.cx("fr-btn--close", "fr-btn")}
                                        aria-controls={searchModalId}
                                        title={t("close")}
                                    >
                                        {t("close")}
                                    </button>
                                    <div className={fr.cx("fr-search-bar")} role="search">
                                        <label
                                            className={fr.cx("fr-label")}
                                            htmlFor={searchInputId}
                                            id={searchLabelId}
                                        >
                                            {tSearchBar("label")}
                                        </label>
                                        {(
                                            renderSearchInput ??
                                            (({
                                                className,
                                                id,
                                                placeholder,
                                                type
                                            }) => (
                                                <input
                                                    className={className}
                                                    id={id}
                                                    placeholder={placeholder}
                                                    type={type}
                                                />
                                            ))
                                        )({
                                            "className": fr.cx("fr-input"),
                                            "id": searchInputId,
                                            "placeholder": tSearchBar("label"),
                                            "type": "search"
                                        })}
                                        <SearchButton
                                            id={`${id}-search-bar-button`}
                                            searchInputId={searchInputId}
                                            onClick={onSearchButtonClick}
                                            clearInputOnSearch={clearSearchInputOnSearch}
                                            allowEmptySearch={allowEmptySearch}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </header>
                </HeaderMenuContext.Provider>
            </>
        );
    })
);

Header.displayName = symToStr({ Header });

export default Header;

export const { useTranslation, addHeaderTranslations } = createComponentI18nApi({
    "componentName": symToStr({ Header }),
    "frMessages": {
        /* spell-checker: disable */
        "menu": "Menu",
        "close": "Fermer"
        /* spell-checker: enable */
    }
});

addHeaderTranslations({
    "lang": "en",
    "messages": {
        "close": "Close"
    }
});

export type HeaderQuickAccessItemProps = {
    className?: string;
    quickAccessItem: HeaderProps.QuickAccessItem;
    id?: string;
};

/** NOTE: If you wrap this component you should forward the id */
export function HeaderQuickAccessItem(props: HeaderQuickAccessItemProps): JSX.Element {
    const { className, quickAccessItem, id } = props;

    const { Link } = getLink();

    return quickAccessItem.linkProps !== undefined ? (
        <Link
            {...quickAccessItem.linkProps}
            className={cx(
                "sds-header__action",
                quickAccessItem.iconId,
                quickAccessItem.linkProps.className,
                className
            )}
            id={id}
        >
            {quickAccessItem.text}
        </Link>
    ) : (
        <button
            {...quickAccessItem.buttonProps}
            className={cx(
                "sds-header__action",
                quickAccessItem.iconId,
                quickAccessItem.buttonProps.className,
                className
            )}
            id={id}
        >
            {quickAccessItem.text}
        </button>
    );
}

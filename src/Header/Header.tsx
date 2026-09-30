/* eslint-disable no-inner-declarations */
import type { JSX } from "../tools/JSX";
import React, {
    memo,
    forwardRef,
    cloneElement,
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
import { MainNavigation } from "../MainNavigation";
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

        const id = id_props ?? "fr-header";

        const menuModalId = `${headerMenuModalIdPrefix}-${id}`;
        const menuButtonId = `${id}-menu-button`;
        const searchModalId = `${id}-search-modal`;
        const searchInputId = `${id}-search-input`;
        const searchLabelId = `${id}-search-label`;

        const isSearchBarEnabled =
            renderSearchInput !== undefined || onSearchButtonClick !== undefined;

        setIdentityAndHomeLinkProps({ identity, homeLinkProps });

        const { t } = useTranslation();
        const { t: tSearchBar } = useSearchBarTranslation();

        const { Link } = getLink();

        const getQuickAccessNode = (usecase: "mobile" | "desktop") => (
            <ul className={fr.cx("fr-btns-group")}>
                {quickAccessItems.map((quickAccessItem, i) => (
                    <li key={i}>
                        {(() => {
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

                            return cloneElement(node, {
                                "id": `${id}-quick-access-item-${i}${(() => {
                                    switch (usecase) {
                                        case "mobile":
                                            return "-mobile";
                                        case "desktop":
                                            return "";
                                    }
                                    assert<Equals<typeof usecase, never>>();
                                })()}`
                            });
                        })()}
                    </li>
                ))}
            </ul>
        );

        return (
            <>
                {!disableDisplay && <Display />}
                <header
                    role="banner"
                    id={id}
                    className={cx(fr.cx("fr-header"), classes.root, className)}
                    ref={ref}
                    style={style}
                    {...rest}
                >
                    <div className={cx(fr.cx("fr-header__body" as any), classes.body)}>
                        <div className={cx(fr.cx("fr-container"), classes.container)}>
                            <div className={cx(fr.cx("fr-header__body-row"), classes.bodyRow)}>
                                <div
                                    className={cx(
                                        fr.cx(
                                            "fr-header__brand",
                                            serviceTitle === undefined && "fr-enlarge-link"
                                        ),
                                        classes.brand
                                    )}
                                >
                                    <div
                                        className={cx(
                                            fr.cx("fr-header__brand-top"),
                                            classes.brandTop
                                        )}
                                    >
                                        <div className={cx(fr.cx("fr-header__logo"), classes.logo)}>
                                            <Link
                                                {...homeLinkProps}
                                                className={cx(
                                                    "sds-identity__link",
                                                    classes.identity
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
                                        </div>

                                        {(quickAccessItems.length > 0 ||
                                            navigation !== undefined ||
                                            isSearchBarEnabled) && (
                                            <div
                                                className={cx(
                                                    fr.cx("fr-header__navbar"),
                                                    classes.navbar
                                                )}
                                            >
                                                {isSearchBarEnabled && (
                                                    <button
                                                        id={`${id}-search-button`}
                                                        className={fr.cx(
                                                            "fr-btn--search",
                                                            "fr-btn"
                                                        )}
                                                        data-fr-opened={false}
                                                        aria-controls={searchModalId}
                                                        title={tSearchBar("label")}
                                                    >
                                                        {tSearchBar("label")}
                                                    </button>
                                                )}
                                                <button
                                                    className={fr.cx("fr-btn--menu", "fr-btn")}
                                                    data-fr-opened="false"
                                                    aria-controls={menuModalId}
                                                    id={menuButtonId}
                                                    title={t("menu")}
                                                >
                                                    {t("menu")}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {serviceTitle !== undefined && (                                            <div
                                                className={cx(
                                                    fr.cx("fr-header__service"),
                                                    classes.service
                                                )}
                                            >
                                            <Link {...homeLinkProps}>
                                                <p
                                                    className={cx(
                                                        fr.cx("fr-header__service-title"),
                                                        classes.serviceTitle
                                                    )}
                                                >
                                                    {serviceTitle}
                                                </p>
                                            </Link>
                                            {serviceTagline !== undefined && (
                                                <p
                                                    className={cx(
                                                        fr.cx("fr-header__service-tagline" as any),
                                                        classes.serviceTagline
                                                    )}
                                                >
                                                    {serviceTagline}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {(quickAccessItems.length > 0 || isSearchBarEnabled) && (
                                    <div className={fr.cx("fr-header__tools")}>
                                        {quickAccessItems.length > 0 && (
                                            <div
                                                className={cx(
                                                    fr.cx("fr-header__tools-links"),
                                                    classes.toolsLinks
                                                )}
                                            >
                                                {getQuickAccessNode("desktop")}
                                            </div>
                                        )}

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
                                                    <div
                                                        className={fr.cx("fr-search-bar")}
                                                        role="search"
                                                    >
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
                                                            clearInputOnSearch={
                                                                clearSearchInputOnSearch
                                                            }
                                                            allowEmptySearch={allowEmptySearch}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {(navigation !== undefined || quickAccessItems.length !== 0) && (
                        <div
                            className={cx(fr.cx("fr-header__menu", "fr-modal"), classes.menu)}
                            id={menuModalId}
                            aria-labelledby={menuButtonId}
                        >
                            <div className={fr.cx("fr-container")}>
                                <button
                                    id={`${id}-mobile-overlay-button-close`}
                                    className={fr.cx("fr-btn--close", "fr-btn")}
                                    aria-controls={menuModalId}
                                    title={t("close")}
                                >
                                    {t("close")}
                                </button>
                                <div
                                    className={cx(
                                        fr.cx("fr-header__menu-links"),
                                        classes.menuLinks
                                    )}
                                >
                                    {getQuickAccessNode("mobile")}
                                </div>
                                {navigation !== undefined &&
                                    (navigation instanceof Array ? (
                                        <MainNavigation
                                            id={`${id}-main-navigation`}
                                            items={navigation}
                                        />
                                    ) : (
                                        navigation
                                    ))}
                            </div>
                        </div>
                    )}
                </header>
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
                fr.cx("fr-btn", quickAccessItem.iconId),
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
                fr.cx("fr-btn", quickAccessItem.iconId),
                quickAccessItem.buttonProps.className,
                className
            )}
            id={id}
        >
            {quickAccessItem.text}
        </button>
    );
}

import type { JSX } from "./tools/JSX";
import React, { memo, forwardRef, type ReactNode, type CSSProperties } from "react";
import { getLink } from "./link";
import type { RegisteredLinkProps } from "./link";
import { symToStr } from "tsafe/symToStr";
import { fr } from "./fr";
import { cx } from "./tools/cx";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { createComponentI18nApi } from "./i18n";
import type { FrIconClassName, RiIconClassName } from "./fr/generatedFromCss/classNames";
import { getIdentityAndHomeLinkProps } from "./zz_internal/identityAndHomeLinkProps";
import type { HeaderProps } from "./Header";
import "./assets/sge-identity.css";
import { typeGuard } from "tsafe/typeGuard";
import { id } from "tsafe/id";

export type FooterProps = {
    id?: string;
    className?: string;
    accessibility: "non compliant" | "partially compliant" | "fully compliant";
    contentDescription?: ReactNode;
    websiteMapLinkProps?: RegisteredLinkProps;
    accessibilityLinkProps?: RegisteredLinkProps;
    termsLinkProps?: RegisteredLinkProps;
    bottomItems?: (FooterProps.BottomItem | ReactNode)[];
    partnersLogos?: FooterProps.PartnersLogos;
    operatorLogo?: {
        orientation: "horizontal" | "vertical";
        /**
         * Expected ratio:
         * If "vertical": 9x16
         * If "horizontal": 16x9
         */
        imgUrl: string;
        /** Textual alternative of the image, it MUST include the text present in the image*/
        alt: string;
    };
    license?: ReactNode;
    /**
     * The institutional identity of the Sky Genesis Enterprise (same prop as the one of the
     * `<Header />`). If not provided, the identity of the `<Header />` will be used.
     * Be aware that if your Header is not used as a server component while the Footer is
     * you need to provide the identity to the Footer.
     */
    identity?: HeaderProps.Identity;
    /** If not provided the homeLinkProps from the Header will be used,
     *  Be aware that if your Header is not used as a server component while the Footer is
     *  you need to provide the homeLinkProps to the Footer.
     */
    homeLinkProps?: RegisteredLinkProps & { title: string };
    classes?: Partial<
        Record<
            | "root"
            | "body"
            | "brand"
            | "content"
            | "contentDesc"
            | "contentList"
            | "contentItem"
            | "contentLink"
            | "bottom"
            | "bottomList"
            | "bottomItem"
            | "bottomLink"
            | "bottomCopy"
            | "brandLink"
            | "logo"
            | "identity"
            | "identityImg"
            | "institution"
            | "operatorLogo"
            | "partners"
            | "partnersTitle"
            | "partnersLogos"
            | "partnersMain"
            | "partnersLink"
            | "partnersSub",
            string
        >
    >;
    style?: CSSProperties;
    linkList?: FooterProps.LinkList.List;
    /**
     * Display a title above the link list, needs linkList to be provided
     */
    linkListTitle?: ReactNode;
    domains?: string[];
};

export namespace FooterProps {
    export type BottomItem = BottomItem.Link | BottomItem.Button;

    export namespace BottomItem {
        export type Common = {
            iconId?: FrIconClassName | RiIconClassName;
            text: ReactNode;
        };

        export type Link = Common & {
            linkProps: RegisteredLinkProps;
            buttonProps?: never;
        };

        export type Button = Common & {
            linkProps?: undefined;
            buttonProps: React.DetailedHTMLProps<
                React.ButtonHTMLAttributes<HTMLButtonElement>,
                HTMLButtonElement
            >;
        };
    }

    export namespace LinkList {
        export type List = [Column, Column?, Column?, Column?, Column?, Column?];
        export type Links = [
            LinkList.Link,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?
        ];
        export interface Column {
            categoryName?: ReactNode;
            links: Links;
        }
        export interface Link {
            text: string;
            linkProps: RegisteredLinkProps;
        }
    }

    export type PartnersLogos = PartnersLogos.MainOnly | PartnersLogos.SubOnly;

    export namespace PartnersLogos {
        export type MainOnly = {
            main: Logo;
            sub?: Logo[];
        };

        export type SubOnly = {
            main?: Logo;
            sub: [Logo, ...Logo[]];
        };

        export type Logo = {
            alt: string;
            /**
             * @deprecated use linkProps instead
             */
            href?: string;
            imgUrl: string;
            linkProps?: RegisteredLinkProps & { title: string };
        };
    }
}

/** @see <https://skygenesisenterprise.github.io/react-sds/?path=/docs/components-footer> */
export const Footer = memo(
    forwardRef<HTMLDivElement, FooterProps>((props, ref) => {
        const {
            id: id_props,
            className,
            classes = {},
            contentDescription,
            websiteMapLinkProps,
            accessibilityLinkProps,
            accessibility,
            termsLinkProps,
            bottomItems = [],
            partnersLogos,
            operatorLogo,
            license,
            identity: identity_prop,
            homeLinkProps: homeLinkProps_prop,
            style,
            linkList,
            linkListTitle,
            domains = [],
            ...rest
        } = props;

        assert<Equals<keyof typeof rest, never>>();

        const rootId = id_props ?? "fr-footer";

        const { identity, homeLinkProps } = (() => {
            const wrap = getIdentityAndHomeLinkProps();

            const identity = identity_prop ?? wrap?.identity;
            const homeLinkProps = homeLinkProps_prop ?? wrap?.homeLinkProps;

            const exceptionMessage =
                " hasn't been provided to the Footer and we cannot retrieve it from the Header (it's probably client side)";

            if (identity === undefined && operatorLogo === undefined) {
                throw new Error(
                    symToStr({ identity }) + " or " + symToStr({ operatorLogo }) + exceptionMessage
                );
            }

            if (homeLinkProps === undefined) {
                throw new Error(symToStr({ homeLinkProps }) + exceptionMessage);
            }

            return { identity, homeLinkProps };
        })();

        const { Link } = getLink();

        const { t } = useTranslation();

        const { main: mainPartnersLogo, sub: subPartnersLogos = [] } = partnersLogos ?? {};

        return (
            <footer
                id={rootId}
                className={cx(fr.cx("fr-footer"), classes.root, className)}
                role="contentinfo"
                ref={ref}
                style={style}
                {...rest}
            >
                {linkList !== undefined && (
                    <div className={fr.cx("fr-footer__top")}>
                        <div className={fr.cx("fr-container")}>
                            {linkListTitle}
                            <div
                                className={fr.cx(
                                    "fr-grid-row",
                                    // "fr-grid-row--start", // why is this class used in dsfr doc?
                                    "fr-grid-row--gutters"
                                )}
                            >
                                {linkList.map(
                                    (column, columnIndex) =>
                                        column !== undefined && (
                                            <div
                                                key={`fr-footer__top-cat-${columnIndex}`}
                                                className={fr.cx(
                                                    "fr-col-12",
                                                    "fr-col-sm-3",
                                                    "fr-col-md-2"
                                                )}
                                            >
                                                {column?.categoryName && (
                                                    <h3 className={fr.cx("fr-footer__top-cat")}>
                                                        {column?.categoryName}
                                                    </h3>
                                                )}
                                                <ul className={fr.cx("fr-footer__top-list")}>
                                                    {column?.links.map(
                                                        (linkItem, linkItemIndex) => (
                                                            <li
                                                                key={`fr-footer__top-link-${linkItemIndex}`}
                                                            >
                                                                <Link
                                                                    {...(linkItem?.linkProps as any)}
                                                                    className={fr.cx(
                                                                        "fr-footer__top-link"
                                                                    )}
                                                                >
                                                                    {linkItem?.text}
                                                                </Link>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className={fr.cx("fr-container")}>
                    <div className={cx(fr.cx("fr-footer__body"), classes.body)}>
                        <div
                            className={cx(
                                fr.cx("fr-footer__brand", "fr-enlarge-link"),
                                classes.brand
                            )}
                        >
                            {(() => {
                                const children =
                                    identity === undefined ? null : (
                                        <div
                                            className={cx(
                                                "sds-identity__footer",
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
                                        </div>
                                    );

                                /* If there is an operator logo it carries the home link,
                                   the identity mark is then displayed unlinked */
                                return operatorLogo !== undefined || children === null ? (
                                    children
                                ) : (
                                    <Link {...homeLinkProps}>{children}</Link>
                                );
                            })()}
                            {operatorLogo !== undefined && (
                                <Link
                                    {...homeLinkProps}
                                    className={cx(
                                        fr.cx("fr-footer__brand-link"),
                                        classes.brandLink,
                                        homeLinkProps.className
                                    )}
                                >
                                    <img
                                        className={cx(
                                            fr.cx("fr-footer__logo"),
                                            classes.operatorLogo
                                        )}
                                        style={(() => {
                                            switch (operatorLogo.orientation) {
                                                case "vertical":
                                                    return { "width": "3.5rem" };
                                                case "horizontal":
                                                    return { "maxWidth": "9.0625rem" };
                                            }
                                        })()}
                                        src={operatorLogo.imgUrl}
                                        alt={operatorLogo.alt}
                                    />
                                </Link>
                            )}
                        </div>
                        <div className={cx(fr.cx("fr-footer__content"), classes.content)}>
                            {contentDescription !== undefined && (
                                <p
                                    className={cx(
                                        fr.cx("fr-footer__content-desc"),
                                        classes.contentDesc
                                    )}
                                >
                                    {contentDescription}
                                </p>
                            )}
                            <ul
                                className={cx(
                                    fr.cx("fr-footer__content-list"),
                                    classes.contentList
                                )}
                            >
                                {domains.map((domain, i) => (
                                    <li
                                        className={cx(
                                            fr.cx("fr-footer__content-item" as any),
                                            classes.contentItem
                                        )}
                                        key={i}
                                    >
                                        <a
                                            className={cx(
                                                fr.cx("fr-footer__content-link"),
                                                classes.contentLink
                                            )}
                                            target="_blank"
                                            href={`https://${domain}`}
                                            title={`${domain} - ${t("open new window")}`}
                                            id={`footer-${domain.replace(/\./g, "-")}-link`}
                                        >
                                            {domain}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {partnersLogos !== undefined && (
                        <div className={cx(fr.cx("fr-footer__partners"), classes.partners)}>
                            <h2
                                className={cx(
                                    fr.cx("fr-footer__partners-title"),
                                    classes.partnersTitle
                                )}
                            >
                                {t("our partners")}
                            </h2>
                            <div
                                className={cx(
                                    fr.cx("fr-footer__partners-logos"),
                                    classes.partnersLogos
                                )}
                            >
                                {mainPartnersLogo !== undefined && (
                                    <div
                                        className={cx(
                                            fr.cx("fr-footer__partners-main"),
                                            classes.partnersMain
                                        )}
                                    >
                                        {(() => {
                                            const children = (
                                                <img
                                                    alt={mainPartnersLogo.alt}
                                                    style={{ height: "5.625rem" }} // should not be hardcoded. Can conflict with ContentSecurityPolicy when "unsafe-inline" is not allowed
                                                    src={mainPartnersLogo.imgUrl}
                                                    className={cx(
                                                        fr.cx("fr-footer__logo"),
                                                        classes.logo
                                                    )}
                                                />
                                            );

                                            const hasLinkProps =
                                                mainPartnersLogo.linkProps !== undefined ||
                                                mainPartnersLogo.href !== undefined;

                                            return hasLinkProps ? (
                                                <Link
                                                    {...mainPartnersLogo.linkProps}
                                                    href={
                                                        mainPartnersLogo.href ??
                                                        mainPartnersLogo.linkProps?.href
                                                    }
                                                    className={cx(
                                                        fr.cx(
                                                            "fr-footer__partners-link",
                                                            "fr-raw-link"
                                                        ),
                                                        classes.partnersLink
                                                    )}
                                                >
                                                    {children}
                                                </Link>
                                            ) : (
                                                children
                                            );
                                        })()}
                                    </div>
                                )}
                                {subPartnersLogos.length !== 0 && (
                                    <div
                                        className={cx(
                                            fr.cx("fr-footer__partners-sub"),
                                            classes.partnersSub
                                        )}
                                    >
                                        <ul>
                                            {subPartnersLogos.map((logo, i) => {
                                                const children = (
                                                    <img
                                                        alt={logo.alt}
                                                        src={logo.imgUrl}
                                                        style={{ "height": "5.625rem" }} // should not be hardcoded. Can conflict with ContentSecurityPolicy when "unsafe-inline" is not allowed
                                                        className={cx(
                                                            fr.cx("fr-footer__logo"),
                                                            classes.logo
                                                        )}
                                                    />
                                                );

                                                const hasLinkProps =
                                                    logo.linkProps !== undefined ||
                                                    logo.href !== undefined;

                                                return (
                                                    <li key={i}>
                                                        {hasLinkProps ? (
                                                            <Link
                                                                {...logo.linkProps}
                                                                href={
                                                                    logo.href ??
                                                                    logo.linkProps?.href
                                                                }
                                                                className={cx(
                                                                    fr.cx(
                                                                        "fr-footer__partners-link",
                                                                        "fr-raw-link"
                                                                    ),
                                                                    classes.partnersLink
                                                                )}
                                                            >
                                                                {children}
                                                            </Link>
                                                        ) : (
                                                            children
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className={cx(fr.cx("fr-footer__bottom"), classes.bottom)}>
                        <ul className={cx(fr.cx("fr-footer__bottom-list"), classes.bottomList)}>
                            {[
                                ...(websiteMapLinkProps === undefined
                                    ? []
                                    : [
                                          id<FooterProps.BottomItem>({
                                              "text": t("website map"),
                                              "linkProps": websiteMapLinkProps
                                          })
                                      ]),
                                id<FooterProps.BottomItem>({
                                    "text": `${t("accessibility")} : ${t(accessibility)}`,
                                    "linkProps": accessibilityLinkProps ?? ({} as any)
                                }),
                                ...(termsLinkProps === undefined
                                    ? []
                                    : [
                                          id<FooterProps.BottomItem>({
                                              "text": t("terms"),
                                              "linkProps": termsLinkProps
                                          })
                                      ]),
                                ...bottomItems
                            ].map((bottomItem, i) => (
                                <li
                                    className={cx(
                                        fr.cx("fr-footer__bottom-item"),
                                        classes.bottomItem,
                                        className
                                    )}
                                    key={i}
                                >
                                    {!typeGuard<FooterProps.BottomItem>(
                                        bottomItem,
                                        bottomItem instanceof Object && "text" in bottomItem
                                    ) ? (
                                        bottomItem
                                    ) : (
                                        <FooterBottomItem
                                            classes={{
                                                "bottomLink": classes.bottomLink
                                            }}
                                            bottomItem={bottomItem}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                        {license !== undefined && (
                            <div
                                className={cx(fr.cx("fr-footer__bottom-copy"), classes.bottomCopy)}
                            >
                                <p>{license}</p>
                            </div>
                        )}
                    </div>
                </div>
            </footer>
        );
    })
);

Footer.displayName = symToStr({ Footer });

export default Footer;

const { useTranslation, addFooterTranslations } = createComponentI18nApi({
    "componentName": symToStr({ Footer }),
    "frMessages": {
        /* spell-checker: disable */
        "hide message": "Masquer le message",
        "website map": "Plan du site",
        "accessibility": "Accessibilité",
        "non compliant": "non conforme",
        "partially compliant": "partiellement conforme",
        "fully compliant": "totalement conforme",
        "terms": "Mentions légales",
        "cookies management": "Gestion des cookies",
        "our partners": "Nos partenaires",
        "open new window": "nouvelle fenêtre"
        /* spell-checker: enable */
    }
});

addFooterTranslations({
    "lang": "en",
    "messages": {
        "hide message": "Hide the message",
        "website map": "Website map",
        "accessibility": "Accessibility",
        "non compliant": "non compliant",
        "partially compliant": "partially compliant",
        "fully compliant": "fully compliant",
        "open new window": "open new window"
    }
});

addFooterTranslations({
    "lang": "es",
    "messages": {
        /* spell-checker: disable */
        "hide message": "Occultar el mesage"
        /* spell-checker: enable */
    }
});

export { addFooterTranslations };

export type FooterBottomItemProps = {
    className?: string;
    bottomItem: FooterProps.BottomItem;
    classes?: Partial<Record<"root" | "bottomLink", string>>;
};

export function FooterBottomItem(props: FooterBottomItemProps): JSX.Element {
    const { className: className_props, bottomItem, classes = {} } = props;

    const { Link } = getLink();

    const className = cx(
        fr.cx(
            "fr-footer__bottom-link",
            ...(bottomItem.iconId !== undefined
                ? ([bottomItem.iconId, "fr-link--icon-left"] as const)
                : [])
        ),
        classes.bottomLink,
        classes.root,
        className_props
    );

    return bottomItem.linkProps !== undefined ? (
        Object.keys(bottomItem.linkProps).length === 0 ? (
            <span className={className}>{bottomItem.text}</span>
        ) : (
            <Link
                {...bottomItem.linkProps}
                className={cx(className, bottomItem.linkProps.className)}
            >
                {bottomItem.text}
            </Link>
        )
    ) : (
        <button
            {...bottomItem.buttonProps}
            className={cx(className, bottomItem.buttonProps.className)}
        >
            {bottomItem.text}
        </button>
    );
}

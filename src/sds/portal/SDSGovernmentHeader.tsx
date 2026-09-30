"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";
import { useOptionalSDSPortal } from "./context";

export type SDSGovernmentHeaderProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Overrides the organization name from <SDSPortal /> when used standalone. */
    organization?: string;
    /** Optional logo element (image). */
    logo?: React.ReactNode;
    /** Link target of the brand / home link. */
    homeHref?: string;
    /** Navigation slot (e.g. <SDSNavigation />). */
    children?: React.ReactNode;
};

/**
 * The institutional government header — a sticky bar with the organization brand
 * (logo + name + tagline) and an optional navigation slot. Reads its identity from
 * <SDSPortal /> when wrapped by it.
 */
export const SDSGovernmentHeader = (props: SDSGovernmentHeaderProps) => {
    const { className, style, organization, logo, homeHref, children } = props;

    const portal = useOptionalSDSPortal();
    const effectiveOrg = organization ?? portal?.organization ?? "";
    const effectiveHref = homeHref ?? portal?.homeHref ?? "/";

    return (
        <header className={cx("sds-gov-header", className)} style={style}>
            <div className="sds-gov-header__inner sds-container">
                <a className="sds-gov-header__brand" href={effectiveHref}>
                    {logo !== undefined && (
                        <span className="sds-gov-header__logo">{logo}</span>
                    )}
                    <span className="sds-gov-header__title">
                        <span className="sds-gov-header__name">{effectiveOrg}</span>
                        {portal?.organizationShort !== undefined && (
                            <span className="sds-gov-header__tagline">
                                {portal.organizationShort}
                            </span>
                        )}
                    </span>
                </a>
                {children !== undefined && (
                    <nav className="sds-gov-header__nav" aria-label="Navigation principale">
                        {children}
                    </nav>
                )}
            </div>
        </header>
    );
};

SDSGovernmentHeader.displayName = symToStr({ SDSGovernmentHeader });

export default SDSGovernmentHeader;
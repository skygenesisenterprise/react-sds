"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";
import { useOptionalSDSPortal } from "./context";

export type SDSMinistryHeaderProps = {
    className?: string;
    style?: React.CSSProperties;
    organization?: string;
    homeHref?: string;
    /** Right-hand actions slot (language switch, account, …). */
    actions?: React.ReactNode;
};

/**
 * A compact ministry header — a single-line institutional strip (name + optional
 * actions). Lighter than <SDSGovernmentHeader />, for interior ministry pages or
 * services.
 */
export const SDSMinistryHeader = (props: SDSMinistryHeaderProps) => {
    const { className, style, organization, homeHref, actions } = props;

    const portal = useOptionalSDSPortal();
    const effectiveOrg = organization ?? portal?.organization ?? "";
    const effectiveHref = homeHref ?? portal?.homeHref ?? "/";

    return (
        <div className={cx("sds-ministry-header", className)} style={style}>
            <a className="sds-ministry-header__brand" href={effectiveHref}>
                <span className="sds-ministry-header__name">{effectiveOrg}</span>
            </a>
            {actions !== undefined && <div className="sds-ministry-header__actions">{actions}</div>}
        </div>
    );
};

SDSMinistryHeader.displayName = symToStr({ SDSMinistryHeader });

export default SDSMinistryHeader;
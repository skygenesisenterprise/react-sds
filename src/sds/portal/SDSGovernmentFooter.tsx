"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";
import { useOptionalSDSPortal } from "./context";

export type SDSFooterColumn = {
    title: string;
    links: { label: string; href: string }[];
};

export type SDSGovernmentFooterProps = {
    className?: string;
    style?: React.CSSProperties;
    organization?: string;
    /** Link columns of the footer. */
    columns?: SDSFooterColumn[];
    /** Bottom (secondary) links. */
    bottomLinks?: { label: string; href: string }[];
    /** Bottom copyright text. Defaults to the organization name. */
    copyright?: string;
};

/**
 * The institutional government footer — a set of link columns plus a bottom bar
 * (copyright + secondary links). Reads the organization from <SDSPortal /> when
 * wrapped by it.
 */
export const SDSGovernmentFooter = (props: SDSGovernmentFooterProps) => {
    const {
        className,
        style,
        organization,
        columns = [],
        bottomLinks = [],
        copyright
    } = props;

    const portal = useOptionalSDSPortal();
    const effectiveOrg = organization ?? portal?.organization ?? "";

    return (
        <footer className={cx("sds-gov-footer", className)} style={style}>
            <div className="sds-container">
                {columns.length > 0 && (
                    <div className="sds-gov-footer__cols">
                        {columns.map((col, index) => (
                            <div key={index}>
                                <h2 className="sds-gov-footer__col-title">{col.title}</h2>
                                <ul className="sds-gov-footer__col">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <a href={link.href}>{link.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                <div className="sds-gov-footer__bottom">
                    <span>{copyright ?? `© ${effectiveOrg}`}</span>
                    {bottomLinks.length > 0 && (
                        <ul className="sds-gov-footer__bottom-links">
                            {bottomLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </footer>
    );
};

SDSGovernmentFooter.displayName = symToStr({ SDSGovernmentFooter });

export default SDSGovernmentFooter;
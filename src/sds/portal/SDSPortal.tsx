"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";
import { SDSPortalProvider } from "./context";

export type SDSPortalProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Name of the institution / ministry (used by header, footer and metadata). */
    organization: string;
    /** Optional short name (e.g. acronym) for compact contexts. */
    organizationShort?: string;
    /** Default link target of the brand / home links. */
    homeHref?: string;
    /** Document language (default `"fr"`). */
    lang?: string;
    children: React.ReactNode;
};

/**
 * The government portal shell. It provides the institutional identity (organization
 * name, home link, language) to the header, footer and hero children through context,
 * and renders a full-height portal wrapper.
 *
 * ```tsx
 * <SDSPortal organization="Ministère de la Défense">
 *     <SDSGovernmentHeader />
 *     <SDSPage>…</SDSPage>
 *     <SDSGovernmentFooter />
 * </SDSPortal>
 * ```
 */
export const SDSPortal = (props: SDSPortalProps) => {
    const {
        className,
        style,
        organization,
        organizationShort,
        homeHref = "/",
        lang = "fr",
        children
    } = props;

    return (
        <SDSPortalProvider value={{ organization, organizationShort, homeHref }}>
            <div className={cx("sds-portal", className)} lang={lang} style={style}>
                {children}
            </div>
        </SDSPortalProvider>
    );
};

SDSPortal.displayName = symToStr({ SDSPortal });

export default SDSPortal;
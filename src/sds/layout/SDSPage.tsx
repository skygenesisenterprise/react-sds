"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-layout.css";

export type SDSPageProps = {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

/**
 * The page shell — a full-height flex column that keeps the main content growing
 * and the footer pinned to the bottom. Use it once at the root of a page.
 *
 * ```tsx
 * <SDSPage>
 *     <SDSGovernmentHeader organization="Ministère de la Défense" />
 *     <SDSMain>…</SDSMain>
 *     <SDSGovernmentFooter organization="Ministère de la Défense" />
 * </SDSPage>
 * ```
 */
export const SDSPage = (props: SDSPageProps) => {
    const { className, style, children } = props;

    return (
        <div className={cx("sds-page", className)} style={style}>
            {children}
        </div>
    );
};

SDSPage.displayName = symToStr({ SDSPage });

export default SDSPage;
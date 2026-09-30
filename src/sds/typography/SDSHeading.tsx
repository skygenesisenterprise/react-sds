"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-typography.css";

export type SDSHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type SDSHeadingProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Semantic heading level (1–6), drives the tag and the default size. */
    level: SDSHeadingLevel;
    /** Optional explicit size override (heading scale 1–6). */
    size?: SDSHeadingLevel;
    children: React.ReactNode;
};

/**
 * A semantic heading. The tag (`h1`…`h6`) and the default font size follow `level`,
 * keeping the page hierarchy correct for assistive technologies without any styling
 * code in the application.
 *
 * ```tsx
 * <SDSHeading level={1}>Ministère de la Défense</SDSHeading>
 * ```
 */
export const SDSHeading = (props: SDSHeadingProps) => {
    const { className, style, level, size, children } = props;

    const Tag = `h${level}` as "h1";
    const effectiveSize = size ?? level;

    return (
        <Tag className={cx("sds-heading", className)} data-level={level} data-size={effectiveSize} style={style}>
            {children}
        </Tag>
    );
};

SDSHeading.displayName = symToStr({ SDSHeading });

export default SDSHeading;
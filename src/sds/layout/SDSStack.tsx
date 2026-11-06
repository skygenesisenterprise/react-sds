"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-layout.css";

export type SDSSpacingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SDSStackAlign = "start" | "center" | "end" | "stretch";

export type SDSStackProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Vertical gap between children, as a spacing token step (1–12). */
    gap?: SDSSpacingStep;
    /** Cross-axis (horizontal) alignment. */
    align?: SDSStackAlign;
    /** Wraps children in a semantic `list` / `ul` when set to `"list"`. */
    as?: "div" | "section" | "aside";
    children: React.ReactNode;
};

/**
 * A vertical flex stack with a consistent spacing gap — the default way to lay out
 * blocks of content one under another.
 *
 * ```tsx
 * <SDSStack gap="8">
 *     <SDSHeading level={1}>…</SDSHeading>
 *     <SDSGrid …>…</SDSGrid>
 * </SDSStack>
 * ```
 */
export const SDSStack = (props: SDSStackProps) => {
    const { className, style, gap, align = "stretch", as = "div", children } = props;

    const Tag = as as "div";

    return (
        <Tag
            className={cx("sds-stack", className)}
            data-gap={gap}
            data-align={align}
            style={style}
        >
            {children}
        </Tag>
    );
};

SDSStack.displayName = symToStr({ SDSStack });

export default SDSStack;
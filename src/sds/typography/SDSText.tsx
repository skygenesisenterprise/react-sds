"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-typography.css";

export type SDSTextSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SDSTextWeight = "regular" | "medium" | "semibold" | "bold";
export type SDSTextColor = "default" | "muted" | "primary";
export type SDSTextMargin = "none" | "top" | "bottom" | "both";
export type SDSTextAlign = "start" | "center" | "end";

export type SDSTextProps = {
    className?: string;
    style?: React.CSSProperties;
    /** HTML tag used to render the text. */
    as?: "p" | "span" | "div" | "small" | "strong" | "label";
    size?: SDSTextSize;
    weight?: SDSTextWeight;
    color?: SDSTextColor;
    margin?: SDSTextMargin;
    align?: SDSTextAlign;
    children: React.ReactNode;
};

/**
 * A typographically-controlled text element. Encapsulates font-size, line-height,
 * weight, color and margin so standard editorial text needs no inline styling.
 */
export const SDSText = (props: SDSTextProps) => {
    const {
        className,
        style,
        as = "p",
        size,
        weight,
        color = "default",
        margin = "none",
        align,
        children
    } = props;

    const Tag = as as "p";

    return (
        <Tag
            className={cx("sds-text", className)}
            data-size={size}
            data-weight={weight}
            data-color={color}
            data-margin={margin}
            data-align={align}
            style={style}
        >
            {children}
        </Tag>
    );
};

SDSText.displayName = symToStr({ SDSText });

export default SDSText;
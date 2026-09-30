"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-layout.css";

export type SDSContainerSize = "default" | "wide" | "narrow";

export type SDSContainerProps = {
    className?: string;
    style?: React.CSSProperties;
    /**
     * Max content width.
     * - `default`: 75rem (coherent with the SDS xl breakpoint)
     * - `wide`: 80rem
     * - `narrow`: 52rem (editorial reading width)
     */
    size?: SDSContainerSize;
    children: React.ReactNode;
};

/**
 * The centered, width-capped column that most page content lives in. Use it to wrap
 * a page section, a hero, a grid, etc.
 *
 * ```tsx
 * <SDSContainer size="wide">…</SDSContainer>
 * ```
 */
export const SDSContainer = (props: SDSContainerProps) => {
    const { className, style, size = "default", children } = props;

    return (
        <div className={cx("sds-container", className)} data-size={size} style={style}>
            {children}
        </div>
    );
};

SDSContainer.displayName = symToStr({ SDSContainer });

export default SDSContainer;
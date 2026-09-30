"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-layout.css";
import type { SDSSpacingStep } from "./SDSStack";

export type SDSGridColumns = {
    /** Column count on mobile (< 36rem). Default `1`. */
    mobile?: number;
    /** Column count on tablet (≥ 36rem). */
    tablet?: number;
    /** Column count on desktop (≥ 62rem). */
    desktop?: number;
};

export type SDSGridProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Responsive column counts. */
    columns?: SDSGridColumns;
    /** Gap between cells, as a spacing token step (1–12). */
    gap?: SDSSpacingStep;
    children: React.ReactNode;
};

/**
 * A responsive CSS grid. Column counts are set per breakpoint and cascade upward
 * (mobile < tablet < desktop).
 *
 * ```tsx
 * <SDSGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="6">
 *     <SDSCard /> <SDSCard /> <SDSCard />
 * </SDSGrid>
 * ```
 */
export const SDSGrid = (props: SDSGridProps) => {
    const { className, style, columns, gap, children } = props;

    const mobile = columns?.mobile ?? 1;
    const tablet = columns?.tablet ?? mobile;
    const desktop = columns?.desktop ?? tablet;

    return (
        <div
            className={cx("sds-grid", className)}
            data-cols-sm={mobile}
            data-cols-md={tablet}
            data-cols-lg={desktop}
            data-gap={gap}
            style={style}
        >
            {children}
        </div>
    );
};

SDSGrid.displayName = symToStr({ SDSGrid });

export default SDSGrid;
"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-layout.css";

export type SDSColumnsProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Number of equal columns (2, 3 or 4). */
    cols?: 2 | 3 | 4;
    /** Gap between columns, as a spacing token step. */
    gap?: 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
    children: React.ReactNode;
};

/**
 * A simple equal-width multi-column layout. Each child becomes one column that
 * wraps to full width on small screens. Prefer <SDSGrid /> for per-breakpoint counts;
 * use <SDSColumns /> for a fixed number of side-by-side blocks.
 */
export const SDSColumns = (props: SDSColumnsProps) => {
    const { className, style, cols, gap, children } = props;

    return (
        <div className={cx("sds-columns", className)} data-cols={cols} data-gap={gap} style={style}>
            {React.Children.map(children, (child, index) => (
                <div key={index} className="sds-columns__item">
                    {child}
                </div>
            ))}
        </div>
    );
};

SDSColumns.displayName = symToStr({ SDSColumns });

export default SDSColumns;
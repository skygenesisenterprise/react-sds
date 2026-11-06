"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-typography.css";

export type SDSLeadProps = {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

/**
 * A section introduction paragraph — larger, muted and width-capped for readability.
 */
export const SDSLead = (props: SDSLeadProps) => {
    const { className, style, children } = props;

    return (
        <p className={cx("sds-lead", className)} style={style}>
            {children}
        </p>
    );
};

SDSLead.displayName = symToStr({ SDSLead });

export default SDSLead;
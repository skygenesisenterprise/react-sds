"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";

export type SDSOfficialNoticeProps = {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

/**
 * The official notice strip shown at the very top of a government page (a legal /
 * identity disclaimer). Use it outside the header.
 */
export const SDSOfficialNotice = (props: SDSOfficialNoticeProps) => {
    const { className, style, children } = props;

    return (
        <p className={cx("sds-official-notice", className)} style={style}>
            {children}
        </p>
    );
};

SDSOfficialNotice.displayName = symToStr({ SDSOfficialNotice });

export default SDSOfficialNotice;
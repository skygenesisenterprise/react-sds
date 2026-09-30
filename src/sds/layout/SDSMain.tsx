"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-layout.css";

export type SDSMainProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Sets the skip-link target id (`id`). Default: `"contenu"`. */
    id?: string;
    children: React.ReactNode;
};

/**
 * The semantic `<main>` landmark of a page. It grows to push the footer down and
 * carries the default `id="contenu"` that the skip-link points to.
 */
export const SDSMain = (props: SDSMainProps) => {
    const { className, style, id = "contenu", children } = props;

    return (
        <main id={id} className={cx("sds-main", className)} style={style}>
            {children}
        </main>
    );
};

SDSMain.displayName = symToStr({ SDSMain });

export default SDSMain;
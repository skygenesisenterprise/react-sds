"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";

export type SDSHeroProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Optional kicker (small uppercase label above the title). */
    kicker?: React.ReactNode;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    /** Actions slot (buttons / links) below the subtitle. */
    actions?: React.ReactNode;
    tone?: "primary" | "subtle";
};

/**
 * The hero banner of a page — an eye-catching headline block with a kicker, a title,
 * a subtitle and optional action buttons.
 */
export const SDSHero = (props: SDSHeroProps) => {
    const { className, style, kicker, title, subtitle, actions, tone = "primary" } = props;

    return (
        <section
            className={cx("sds-hero", tone === "subtle" && "sds-hero--subtle", className)}
            data-tone={tone}
            style={style}
        >
            <div className="sds-container">
                {kicker !== undefined && <p className="sds-hero__kicker">{kicker}</p>}
                {title !== undefined && <h1 className="sds-hero__title">{title}</h1>}
                {subtitle !== undefined && <p className="sds-hero__subtitle">{subtitle}</p>}
                {actions !== undefined && <div className="sds-hero__actions">{actions}</div>}
            </div>
        </section>
    );
};

SDSHero.displayName = symToStr({ SDSHero });

export default SDSHero;
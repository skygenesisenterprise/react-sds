"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-layout.css";

export type SDSSectionTone = "default" | "subtle";

export type SDSSectionProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Optional background tone. `subtle` uses the muted surface. */
    tone?: SDSSectionTone;
    /** Optional section title rendered as a heading above the content. */
    title?: React.ReactNode;
    /** Optional short description under the title. */
    subtitle?: React.ReactNode;
    /** Optional action slot on the right of the section header. */
    action?: React.ReactNode;
    /** Heading level used for `title` (default `2`). */
    titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    children: React.ReactNode;
};

/**
 * A vertical rhythm section of the page, optionally with a header (title + subtitle +
 * action) and a subtle background.
 */
export const SDSSection = (props: SDSSectionProps) => {
    const { className, style, tone = "default", title, subtitle, action, titleLevel = 2, children } =
        props;

    const HeadingTag = `h${titleLevel}` as "h2";

    return (
        <section className={cx("sds-section", className)} data-tone={tone} style={style}>
            {(title !== undefined || action !== undefined) && (
                <div className="sds-section__header">
                    <div>
                        {title !== undefined && (
                            <HeadingTag className="sds-section__title">{title}</HeadingTag>
                        )}
                        {subtitle !== undefined && (
                            <p className="sds-section__subtitle">{subtitle}</p>
                        )}
                    </div>
                    {action !== undefined && <div>{action}</div>}
                </div>
            )}
            {children}
        </section>
    );
};

SDSSection.displayName = symToStr({ SDSSection });

export default SDSSection;
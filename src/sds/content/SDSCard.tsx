"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-card.css";

export type SDSCardVariant = "default" | "flat";
export type SDSCardTone = "default" | "subtle";

export type SDSCardProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Renders the title as a link when provided. */
    href?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Optional media rendered above the card body (image / figure). */
    media?: React.ReactNode;
    /** Optional tag/kicker shown above the title. */
    tag?: React.ReactNode;
    /** Slot rendered below the description (e.g. an action link). */
    footer?: React.ReactNode;
    variant?: SDSCardVariant;
    tone?: SDSCardTone;
    children?: React.ReactNode;
};

/**
 * The base government card — a surfaced block with an optional title, description,
 * media, tag and footer. The whole card receives focus styling when its link is
 * focused (focus-within).
 */
export const SDSCard = (props: SDSCardProps) => {
    const {
        className,
        style,
        href,
        title,
        description,
        media,
        tag,
        footer,
        variant = "default",
        tone = "default",
        children
    } = props;

    const titleNode =
        href !== undefined && title !== undefined ? (
            <a href={href}>{title}</a>
        ) : (
            title
        );

    return (
        <article
            className={cx("sds-card", className)}
            data-variant={variant}
            data-tone={tone}
            style={style}
        >
            {media !== undefined && <div className="sds-card__media">{media}</div>}
            {tag !== undefined && <span className="sds-card__tag">{tag}</span>}
            {title !== undefined && <h3 className="sds-card__title">{titleNode}</h3>}
            {description !== undefined && (
                <p className="sds-card__description">{description}</p>
            )}
            {children}
            {footer !== undefined && <div className="sds-card__footer">{footer}</div>}
        </article>
    );
};

SDSCard.displayName = symToStr({ SDSCard });

export default SDSCard;
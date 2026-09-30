"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-card.css";

export type SDSArticleCardProps = {
    className?: string;
    style?: React.CSSProperties;
    href?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Publication date, shown as an uppercase caption. */
    date?: string;
    /** Optional cover image. */
    image?: React.ReactNode;
    /** Label of the "read more" link (default `"Lire la suite"`). */
    linkLabel?: string;
};

/**
 * A news / article card with an optional 16:9 image, a date caption, a title, a
 * description and a "read more" link.
 */
export const SDSArticleCard = (props: SDSArticleCardProps) => {
    const {
        className,
        style,
        href,
        title,
        description,
        date,
        image,
        linkLabel = "Lire la suite"
    } = props;

    const titleNode =
        href !== undefined && title !== undefined ? <a href={href}>{title}</a> : title;

    return (
        <article className={cx("sds-article-card", className)} style={style}>
            {image !== undefined && <div className="sds-article-card__media">{image}</div>}
            {date !== undefined && <span className="sds-article-card__date">{date}</span>}
            {title !== undefined && <h3 className="sds-article-card__title">{titleNode}</h3>}
            {description !== undefined && (
                <p className="sds-article-card__description">{description}</p>
            )}
            {href !== undefined && (
                <SDSArticleLink href={href} className="sds-article-card__link">
                    {linkLabel}
                </SDSArticleLink>
            )}
        </article>
    );
};

const SDSArticleLink = (props: { href: string; className?: string; children: React.ReactNode }) => {
    const { href, className, children } = props;

    return (
        <a href={href} className={cx("sds-link", "sds-link--action", className)}>
            {children}
            <i className="fr-icon-arrow-right-line" aria-hidden="true" />
        </a>
    );
};

SDSArticleCard.displayName = symToStr({ SDSArticleCard });

export default SDSArticleCard;
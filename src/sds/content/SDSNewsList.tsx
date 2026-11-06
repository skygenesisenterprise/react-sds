"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-card.css";
import { SDSArticleCard } from "./SDSArticleCard";
import type { SDSArticleCardProps } from "./SDSArticleCard";

export type SDSNewsListProps = {
    className?: string;
    style?: React.CSSProperties;
    items: SDSArticleCardProps[];
    /** Render the items as a horizontal 3-column grid instead of a vertical list. */
    horizontal?: boolean;
};

/**
 * A list of news / article cards.
 *
 * ```tsx
 * <SDSNewsList
 *   horizontal
 *   items={[
 *     { title: "…", description: "…", date: "12 janv. 2026", href: "/…" },
 *   ]}
 * />
 * ```
 */
export const SDSNewsList = (props: SDSNewsListProps) => {
    const { className, style, items, horizontal } = props;

    return (
        <ul
            className={cx("sds-news-list", horizontal && "sds-news-list--horizontal", className)}
            style={style}
        >
            {items.map((item, index) => (
                <li key={index}>
                    <SDSArticleCard {...item} />
                </li>
            ))}
        </ul>
    );
};

SDSNewsList.displayName = symToStr({ SDSNewsList });

export default SDSNewsList;
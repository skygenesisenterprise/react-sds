"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-card.css";

export type SDSLinkListItem = {
    label: string;
    href: string;
    description?: string;
};

export type SDSLinkListProps = {
    className?: string;
    style?: React.CSSProperties;
    /** Optional heading rendered above the list. */
    title?: React.ReactNode;
    items: SDSLinkListItem[];
};

/**
 * A bordered list of links, each with an optional description and a trailing arrow —
 * the classic "related links / practical info" block of a government page.
 */
export const SDSLinkList = (props: SDSLinkListProps) => {
    const { className, style, title, items } = props;

    return (
        <div className={cx("sds-link-list-wrap", className)} style={style}>
            {title !== undefined && (
                <h2 className="sds-link-list__title">{title}</h2>
            )}
            <ul className="sds-link-list">
                {items.map((item, index) => (
                    <li key={index} className="sds-link-list__item">
                        <a href={item.href} className="sds-link-list__link">
                            <span>
                                {item.label}
                                {item.description !== undefined && (
                                    <span className="sds-link-list__description">
                                        {item.description}
                                    </span>
                                )}
                            </span>
                            <i className="fr-icon-arrow-right-line" aria-hidden="true" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

SDSLinkList.displayName = symToStr({ SDSLinkList });

export default SDSLinkList;
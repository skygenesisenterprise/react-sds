"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";

export type SDSBreadcrumbItem = {
    label: string;
    href?: string;
};

export type SDSBreadcrumbProps = {
    className?: string;
    style?: React.CSSProperties;
    items: SDSBreadcrumbItem[];
};

/**
 * A semantic breadcrumb navigation. The last item is the current page and is marked
 * with `aria-current="page"`.
 */
export const SDSBreadcrumb = (props: SDSBreadcrumbProps) => {
    const { className, style, items } = props;

    return (
        <nav className={cx("sds-breadcrumb", className)} style={style} aria-label="Fil d'Ariane">
            <ol className="sds-breadcrumb__list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li
                            key={index}
                            className="sds-breadcrumb__item"
                            aria-current={isLast ? "page" : undefined}
                        >
                            {!isLast && item.href !== undefined ? (
                                <a href={item.href} className="sds-breadcrumb__link">
                                    {item.label}
                                </a>
                            ) : (
                                <span>{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

SDSBreadcrumb.displayName = symToStr({ SDSBreadcrumb });

export default SDSBreadcrumb;
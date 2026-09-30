"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";

export type SDSNavigationItem = {
    label: string;
    href: string;
    active?: boolean;
};

export type SDSNavigationProps = {
    className?: string;
    style?: React.CSSProperties;
    items: SDSNavigationItem[];
    /** Accessible label of the navigation. */
    label?: string;
};

/**
 * A horizontal top-level navigation bar. Active items are marked with
 * `aria-current="page"` and a primary underline.
 */
export const SDSNavigation = (props: SDSNavigationProps) => {
    const { className, style, items, label = "Navigation principale" } = props;

    return (
        <nav className={cx("sds-nav", className)} style={style} aria-label={label}>
            <ul className="sds-nav__list">
                {items.map((item, index) => (
                    <li key={index}>
                        <a
                            href={item.href}
                            className="sds-nav__link"
                            aria-current={item.active ? "page" : undefined}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

SDSNavigation.displayName = symToStr({ SDSNavigation });

export default SDSNavigation;
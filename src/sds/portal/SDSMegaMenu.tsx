"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";

export type SDSMegaMenuColumn = {
    title: string;
    links: { label: string; href: string }[];
};

export type SDSMegaMenuProps = {
    className?: string;
    style?: React.CSSProperties;
    /** The trigger label shown in the nav bar. */
    label: string;
    /** Link target of the trigger (optional; when set the label is a link). */
    href?: string;
    columns: SDSMegaMenuColumn[];
};

/**
 * A mega menu: a trigger in the navigation that opens a wide panel of link columns.
 * Keyboard accessible (Enter / Space toggles, Escape closes, focus moves into the
 * panel) and collapses to a static block on small screens.
 */
export const SDSMegaMenu = (props: SDSMegaMenuProps) => {
    const { className, style, label, href, columns } = props;

    const [isOpen, setIsOpen] = React.useState(false);
    const panelId = React.useId();

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <div className={cx("sds-mega-menu", className)} style={style} onKeyDown={onKeyDown}>
            <button
                type="button"
                className="sds-mega-menu__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setIsOpen(o => !o)}
            >
                {label}
                <i
                    className={cx("fr-icon-arrow-down-s-line", isOpen && "sds-mega-menu__chevron-open")}
                    aria-hidden="true"
                />
            </button>

            <div className="sds-mega-menu__panel" id={panelId} hidden={!isOpen}>
                <div className="sds-mega-menu__cols">
                    {columns.map((col, index) => (
                        <div key={index}>
                            <h3 className="sds-mega-menu__col-title">{col.title}</h3>
                            <ul className="sds-mega-menu__links">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <a href={link.href} onClick={() => setIsOpen(false)}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {href !== undefined && (
                    <p className="sds-mega-menu__more">
                        <a href={href}>{label} — voir tout</a>
                    </p>
                )}
            </div>
        </div>
    );
};

SDSMegaMenu.displayName = symToStr({ SDSMegaMenu });

export default SDSMegaMenu;
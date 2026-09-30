"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-typography.css";

export type SDSLinkVariant = "default" | "muted" | "action";

export type SDSLinkProps = {
    className?: string;
    style?: React.CSSProperties;
    href: string;
    /** `action` renders as a standalone call-to-action (optionally with `iconId`). */
    variant?: SDSLinkVariant;
    /** Icon id (e.g. `fr-icon-arrow-right-line`) shown when `variant="action"`. */
    iconId?: string;
    /** Opens in a new tab and signals it to assistive technologies. */
    external?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    children: React.ReactNode;
    /** Set when the link needs to be read differently. */
    "aria-label"?: string;
};

/**
 * A styled link. `variant="muted"` renders as an inline text link, `variant="action"`
 * as a standalone call-to-action with an optional trailing icon and an underline.
 */
export const SDSLink = (props: SDSLinkProps) => {
    const {
        className,
        style,
        href,
        variant = "default",
        iconId,
        external,
        disabled,
        onClick,
        children,
        ...rest
    } = props;

    return (
        <a
            href={disabled ? undefined : href}
            className={cx(
                "sds-link",
                variant === "action" && "sds-link--action",
                className
            )}
            data-variant={variant}
            style={style}
            onClick={disabled ? undefined : onClick}
            aria-disabled={disabled || undefined}
            aria-label={rest["aria-label"]}
            {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
            {children}
            {iconId !== undefined && <i className={iconId} aria-hidden="true" />}
        </a>
    );
};

SDSLink.displayName = symToStr({ SDSLink });

export default SDSLink;
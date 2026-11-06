"use client";

import React, { forwardRef, memo, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { cx } from "./tools/cx";
import { symToStr } from "tsafe/symToStr";
import type { FrIconClassName, RiIconClassName } from "./fr/generatedFromCss/classNames";
import "./styles/components/back-to-top.css";

export type BackToTopProps = {
    className?: string;
    style?: CSSProperties;
    /**
     * Vertical scroll offset (in px) after which the button becomes visible.
     * Default: `400`.
     */
    threshold?: number;
    /**
     * Accessible label of the button (read by assistive technologies and used as
     * the tooltip). Default: `"Retour en haut de page"`.
     */
    label?: string;
    /**
     * Icon shown inside the button. Default: `"fr-icon-arrow-up-line"`.
     */
    iconId?: FrIconClassName | RiIconClassName;
};

/** @see <https://skygenesisenterprise.github.io/react-sds/?path=/docs/components-backtotop> */
export const BackToTop = memo(
    forwardRef<HTMLButtonElement, BackToTopProps>((props, ref) => {
        const {
            className,
            style,
            threshold = 400,
            label = "Retour en haut de page",
            iconId = "fr-icon-arrow-up-line"
        } = props;

        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            const onScroll = () => setIsVisible(window.scrollY > threshold);

            onScroll();

            window.addEventListener("scroll", onScroll, { "passive": true });

            return () => window.removeEventListener("scroll", onScroll);
        }, [threshold]);

        const onButtonClick = () => {
            const prefersReducedMotion =
                typeof window.matchMedia === "function" &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            window.scrollTo({
                "top": 0,
                "behavior": prefersReducedMotion ? "auto" : "smooth"
            });
        };

        return (
            <button
                type="button"
                ref={ref}
                className={cx("sds-back-to-top", isVisible && "is-visible", className)}
                style={style}
                onClick={onButtonClick}
                tabIndex={isVisible ? 0 : -1}
                aria-hidden={!isVisible}
                aria-label={label}
                title={label}
            >
                <i className={iconId} aria-hidden="true" />
            </button>
        );
    })
);

BackToTop.displayName = symToStr({ BackToTop });

export default BackToTop;

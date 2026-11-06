"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-portal.css";

export type SDSServiceBannerTone = "info" | "success" | "warning" | "danger";

export type SDSServiceBannerProps = {
    className?: string;
    style?: React.CSSProperties;
    tone?: SDSServiceBannerTone;
    title?: React.ReactNode;
    children: React.ReactNode;
};

const ICON_BY_TONE: Record<SDSServiceBannerTone, string> = {
    info: "fr-icon-information-line",
    success: "fr-icon-checkbox-circle-line",
    warning: "fr-icon-alarm-warning-line",
    danger: "fr-icon-error-warning-line"
};

/**
 * A service status banner (operational / incident / maintenance) with a tone icon.
 */
export const SDSServiceBanner = (props: SDSServiceBannerProps) => {
    const { className, style, tone = "info", title, children } = props;

    return (
        <div className={cx("sds-service-banner", className)} data-tone={tone} style={style} role="status">
            <i className={cx(ICON_BY_TONE[tone], "sds-service-banner__icon")} aria-hidden="true" />
            <div>
                {title !== undefined && <p className="sds-service-banner__title">{title}</p>}
                <div className="sds-service-banner__body">{children}</div>
            </div>
        </div>
    );
};

SDSServiceBanner.displayName = symToStr({ SDSServiceBanner });

export default SDSServiceBanner;
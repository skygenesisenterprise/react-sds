"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-card.css";

export type SDSDownloadProps = {
    className?: string;
    style?: React.CSSProperties;
    href: string;
    /** Link label. */
    label: string;
    /** File meta appended to the label (type + size). */
    fileType?: string;
    fileSize?: string;
};

/**
 * A download link with a leading download icon and an optional file meta line.
 */
export const SDSDownload = (props: SDSDownloadProps) => {
    const { className, style, href, label, fileType, fileSize } = props;

    const meta = [fileType, fileSize].filter(Boolean).join(" · ");

    return (
        <a
            href={href}
            download
            className={cx("sds-download", className)}
            style={style}
        >
            <i className="fr-icon-download-line" aria-hidden="true" />
            <span className="sds-download__body">
                <span className="sds-download__label">{label}</span>
                {meta !== "" && <span className="sds-download__meta">{meta}</span>}
            </span>
        </a>
    );
};

SDSDownload.displayName = symToStr({ SDSDownload });

export default SDSDownload;
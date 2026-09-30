"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-card.css";

export type SDSDocumentProps = {
    className?: string;
    style?: React.CSSProperties;
    href?: string;
    title?: React.ReactNode;
    /** File extension label shown in the meta line (e.g. `"PDF"`). */
    fileType?: string;
    /** Human file size (e.g. `"1,2 Mo"`). */
    fileSize?: string;
    /** Optional publication date. */
    date?: string;
    /** Icon id for the file (default `fr-icon-file-pdf-line`). */
    iconId?: string;
};

/**
 * A document reference block — an icon, a title, a file meta line and a download
 * action. Used for reports, forms, directives, etc.
 */
export const SDSDocument = (props: SDSDocumentProps) => {
    const {
        className,
        style,
        href,
        title,
        fileType,
        fileSize,
        date,
        iconId = "fr-icon-file-pdf-line"
    } = props;

    const titleNode =
        href !== undefined && title !== undefined ? <a href={href}>{title}</a> : title;

    return (
        <article className={cx("sds-document", className)} style={style}>
            <span className="sds-document__icon" aria-hidden="true">
                <i className={iconId} />
            </span>
            <div className="sds-document__body">
                {title !== undefined && <h3 className="sds-document__title">{titleNode}</h3>}
                {(fileType !== undefined || fileSize !== undefined || date !== undefined) && (
                    <span className="sds-document__meta">
                        {[fileType, fileSize, date].filter(Boolean).join(" · ")}
                    </span>
                )}
            </div>
            {href !== undefined && (
                <span className="sds-document__action">
                    <i className="fr-icon-download-line" aria-hidden="true" />
                </span>
            )}
        </article>
    );
};

SDSDocument.displayName = symToStr({ SDSDocument });

export default SDSDocument;
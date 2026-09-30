"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-search.css";

export type SDSPaginationProps = {
    className?: string;
    style?: React.CSSProperties;
    /** 1-based index of the current page. */
    currentPage: number;
    /** Total number of pages. */
    pageCount: number;
    /**
     * Called with the target page number. If `hrefBuilder` is provided the links are
     * real `<a href>` links (better for SEO / SSR).
     */
    onPageChange?: (page: number) => void;
    /** Builds an href for a given page (replaces `onPageChange` with real links). */
    hrefBuilder?: (page: number) => string;
    /** Number of visible neighbours around the current page (default `1`). */
    siblings?: number;
    /** Accessible label of the navigation. */
    label?: string;
};

/**
 * A pagination bar. Shows numbered pages with ellipses, previous/next controls and
 * a visually-hidden label for assistive technologies.
 */
export const SDSPagination = (props: SDSPaginationProps) => {
    const {
        className,
        style,
        currentPage,
        pageCount,
        onPageChange,
        hrefBuilder,
        siblings = 1,
        label = "Pagination"
    } = props;

    const pages = React.useMemo(() => {
        const set = new Set<number>([1, pageCount, currentPage]);

        for (let i = 1; i <= siblings; i++) {
            set.add(currentPage - i);
            set.add(currentPage + i);
        }

        const sorted = Array.from(set)
            .filter(p => p >= 1 && p <= pageCount)
            .sort((a, b) => a - b);

        const withEllipsis: (number | "...")[] = [];

        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
                withEllipsis.push("...");
            }
            withEllipsis.push(sorted[i]);
        }

        return withEllipsis;
    }, [currentPage, pageCount, siblings]);

    const renderLink = (page: number, content: React.ReactNode, extra?: Record<string, unknown>) => {
        const href = hrefBuilder?.(page);
        const isDisabled = page === currentPage;

        if (href !== undefined) {
            return (
                <a
                    href={href}
                    className="sds-pagination__link"
                    aria-current={page === currentPage ? "page" : undefined}
                    aria-disabled={isDisabled || undefined}
                    {...extra}
                >
                    {content}
                </a>
            );
        }

        return (
            <button
                type="button"
                className="sds-pagination__link"
                onClick={() => onPageChange?.(page)}
                aria-current={page === currentPage ? "page" : undefined}
                disabled={isDisabled}
                {...extra}
            >
                {content}
            </button>
        );
    };

    return (
        <nav className={cx("sds-pagination-wrap", className)} style={style} aria-label={label}>
            <ul className="sds-pagination">
                {currentPage > 1 && (
                    <li className="sds-pagination__item">
                        {renderLink(
                            currentPage - 1,
                            <i className="fr-icon-arrow-left-s-line" aria-hidden="true" />,
                            { "aria-label": "Page précédente" }
                        )}
                    </li>
                )}

                {pages.map((page, index) =>
                    page === "..." ? (
                        <li key={`e-${index}`}>
                            <span className="sds-pagination__ellipsis" aria-hidden="true">
                                …
                            </span>
                        </li>
                    ) : (
                        <li key={page} className="sds-pagination__item">
                            <span className="sds-pagination__label">{label}</span>
                            {renderLink(page, page)}
                        </li>
                    )
                )}

                {currentPage < pageCount && (
                    <li className="sds-pagination__item">
                        {renderLink(
                            currentPage + 1,
                            <i className="fr-icon-arrow-right-s-line" aria-hidden="true" />,
                            { "aria-label": "Page suivante" }
                        )}
                    </li>
                )}
            </ul>
        </nav>
    );
};

SDSPagination.displayName = symToStr({ SDSPagination });

export default SDSPagination;
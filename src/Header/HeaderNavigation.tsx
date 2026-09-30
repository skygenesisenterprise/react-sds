import React, { memo } from "react";
import { symToStr } from "tsafe/symToStr";
import { getLink } from "../link";
import { cx } from "../tools/cx";
import type { MainNavigationProps } from "../MainNavigation";
import type { MegaMenuProps } from "../MainNavigation/MegaMenu";

export type HeaderNavigationProps = {
    id: string;
    items: MainNavigationProps.Item[];
    className?: string;
};

/**
 * SDS header navigation — the `[navigation]` zone of the single-line `<Header />`.
 *
 * This is a self-contained navigation primitive owned by the header: a horizontal list
 * of links where items with sub-links open a dropdown. Dropdowns use the native
 * `<details>/<summary>` disclosure pattern, so they work without any framework script,
 * are keyboard accessible, and do not depend on the legacy navigation stylesheet.
 *
 * The data shape is the existing `MainNavigationProps.Item[]` (`Link`, `Menu`,
 * `MegaMenu`) so the public `navigation` prop of `<Header />` is unchanged.
 */
export const HeaderNavigation = memo((props: HeaderNavigationProps) => {
    const { id, items, className } = props;

    const { Link } = getLink();

    return (
        <ul id={id} className={cx("sds-header__nav", className)}>
            {items.map((item, i) => {
                if ("megaMenu" in item && item.megaMenu !== undefined) {
                    return (
                        <li key={i} className="sds-header__nav-item">
                            <details className="sds-header__nav-details">
                                <summary
                                    className={cx(
                                        "sds-header__nav-link",
                                        item.isActive && "sds-header__nav-link--active",
                                        item.className
                                    )}
                                >
                                    {item.text}
                                </summary>
                                <div className="sds-header__nav-megamenu">
                                    {item.megaMenu.categories.map((category, j) => (
                                        <div key={j} className="sds-header__nav-group">
                                            <CategoryHeading category={category} />
                                            <ul className="sds-header__nav-sublist">
                                                {category.links.map((link, k) => (
                                                    <li key={k}>
                                                        <Link
                                                            {...link.linkProps}
                                                            className={cx(
                                                                "sds-header__nav-sublink",
                                                                link.linkProps.className
                                                            )}
                                                            {...(link.isActive && {
                                                                "aria-current": "page"
                                                            })}
                                                        >
                                                            {link.text}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        </li>
                    );
                }

                if ("menuLinks" in item && item.menuLinks !== undefined) {
                    return (
                        <li key={i} className="sds-header__nav-item">
                            <details className="sds-header__nav-details">
                                <summary
                                    className={cx(
                                        "sds-header__nav-link",
                                        item.isActive && "sds-header__nav-link--active",
                                        item.className
                                    )}
                                >
                                    {item.text}
                                </summary>
                                <ul className="sds-header__nav-sublist">
                                    {item.menuLinks.map((link, k) => (
                                        <li key={k}>
                                            <Link
                                                {...link.linkProps}
                                                className={cx(
                                                    "sds-header__nav-sublink",
                                                    link.linkProps.className
                                                )}
                                                {...(link.isActive && {
                                                    "aria-current": "page"
                                                })}
                                            >
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </li>
                    );
                }

                const { text, linkProps, isActive = false, className: itemClassName } =
                    item as MainNavigationProps.Item.Link;

                return (
                    <li key={i} className="sds-header__nav-item">
                        <Link
                            {...linkProps}
                            className={cx(
                                "sds-header__nav-link",
                                isActive && "sds-header__nav-link--active",
                                itemClassName,
                                linkProps.className
                            )}
                            {...(isActive && { "aria-current": "page" })}
                        >
                            {text}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
});

HeaderNavigation.displayName = symToStr({ HeaderNavigation });

function CategoryHeading(props: { category: MegaMenuProps.Category }): React.ReactElement {
    const { category } = props;

    const { Link } = getLink();

    if (category.categoryMainText !== undefined) {
        return (
            <p className="sds-header__nav-group-title">{category.categoryMainText}</p>
        );
    }

    if (category.categoryMainLink !== undefined) {
        return (
            <Link
                {...category.categoryMainLink.linkProps}
                className="sds-header__nav-group-title"
            >
                {category.categoryMainLink.text}
            </Link>
        );
    }

    return <></>;
}

"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-search.css";

export type SDSSearchProps = {
    className?: string;
    style?: React.CSSProperties;
    name?: string;
    placeholder?: string;
    buttonLabel?: string;
    defaultValue?: string;
    onSubmit?: (query: string) => void;
    disabled?: boolean;
};

/**
 * A labelled search form (input + submit button). Submits the current query to
 * `onSubmit`. The input has an accessible label and a visible focus ring.
 */
export const SDSSearch = (props: SDSSearchProps) => {
    const {
        className,
        style,
        name = "query",
        placeholder = "Rechercher",
        buttonLabel = "Rechercher",
        defaultValue = "",
        onSubmit,
        disabled
    } = props;

    const inputId = React.useId();
    const [value, setValue] = React.useState(defaultValue);

    const onFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit?.(value.trim());
    };

    return (
        <form
            className={cx("sds-search", className)}
            style={style}
            role="search"
            onSubmit={onFormSubmit}
        >
            <label htmlFor={inputId} className="sds-search__label">
                {placeholder}
            </label>
            <input
                id={inputId}
                type="search"
                name={name}
                className="sds-search__input"
                placeholder={placeholder}
                value={value}
                onChange={event => setValue(event.target.value)}
                disabled={disabled}
                autoComplete="off"
            />
            <button type="submit" className="sds-search__button" disabled={disabled}>
                {buttonLabel}
                <i className="fr-icon-search-line" aria-hidden="true" />
            </button>
        </form>
    );
};

SDSSearch.displayName = symToStr({ SDSSearch });

export default SDSSearch;
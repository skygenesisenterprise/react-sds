/**
 * SDS Native `TextArea` — a multiline text input.
 */

import * as React from "react";
import { Input, type InputProps } from "./Input";

export type TextAreaProps = Omit<InputProps, "multiline"> & {
    /** Number of visible lines. Default 4 (maps to a proportional height). */
    numberOfLines?: number;
};

export function TextArea(props: TextAreaProps) {
    const { numberOfLines = 4, style, ...rest } = props;

    const extraStyle = style === undefined ? [] : Array.isArray(style) ? style : [style];

    return (
        <Input
            {...rest}
            multiline
            numberOfLines={numberOfLines}
            style={[{ height: undefined, minHeight: 44 * numberOfLines }, ...extraStyle]}
        />
    );
}

TextArea.displayName = "TextArea";

export default TextArea;

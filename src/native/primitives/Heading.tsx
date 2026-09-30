/**
 * SDS Native `Heading` primitive.
 */

import * as React from "react";
import { Text as RNText } from "react-native";
import type { TextProps as RNTextProps, TextStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = Omit<RNTextProps, "style"> & {
    /** Default 1. */
    level?: HeadingLevel;
    /** Default false (headings are accessible via `accessibilityRole="header"`). */
    accessible?: boolean;
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
};

export function Heading(props: HeadingProps) {
    const { level = 1, accessible, style, ...rest } = props;

    const { colors, tokens } = useSDSTheme();

    const size = (() => {
        switch (level) {
            case 1:
                return tokens.typography["fontSize-3xl"];
            case 2:
                return tokens.typography["fontSize-2xl"];
            case 3:
                return tokens.typography["fontSize-xl"];
            case 4:
                return tokens.typography["fontSize-lg"];
            case 5:
                return tokens.typography["fontSize-md"];
            case 6:
                return tokens.typography["fontSize-sm"];
        }
    })();

    const headingStyle: TextStyle = {
        color: colors.foreground,
        fontSize: size,
        lineHeight: tokens.typography["lineHeight-heading"],
        fontWeight: tokens.typography["fontWeight-semibold"]
    };

    return (
        <RNText
            {...rest}
            accessible={accessible ?? true}
            accessibilityRole="header"
            style={[headingStyle, style]}
        />
    );
}

Heading.displayName = "Heading";

export default Heading;

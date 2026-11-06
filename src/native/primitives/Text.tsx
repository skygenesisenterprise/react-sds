/**
 * SDS Native `Text` primitive.
 */

import * as React from "react";
import { Text as RNText } from "react-native";
import type { TextProps as RNTextProps, TextStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type TextVariant = "body" | "bodySmall" | "caption" | "label" | "muted";

export type TextProps = Omit<RNTextProps, "style"> & {
    /** Default "body". */
    variant?: TextVariant;
    /** Alias of `variant="muted"` for convenience. */
    muted?: boolean;
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
};

export function Text(props: TextProps) {
    const { variant = "body", muted, style, ...rest } = props;

    const { colors, tokens } = useSDSTheme();

    const base: TextStyle = {
        color: muted ? colors.muted : colors.text,
        fontSize: tokens.typography["fontSize-md"],
        lineHeight: tokens.typography["lineHeight-body"]
    };

    const variantStyle: TextStyle =
        variant === "body"
            ? {}
            : variant === "bodySmall"
              ? {
                    fontSize: tokens.typography["fontSize-sm"],
                    lineHeight: tokens.typography["lineHeight-normal"]
                }
              : variant === "caption"
                ? {
                      fontSize: tokens.typography["fontSize-xs"],
                      lineHeight: tokens.typography["lineHeight-tight"],
                      color: muted ? colors.muted : colors.textMuted
                  }
                : variant === "label"
                  ? {
                        fontSize: tokens.typography["fontSize-sm"],
                        fontWeight: tokens.typography["fontWeight-medium"]
                    }
                  : { color: colors.textMuted };

    return <RNText {...rest} style={[base, variantStyle, style]} />;
}

Text.displayName = "Text";

export default Text;

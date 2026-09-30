/**
 * SDS Native `Divider` primitive (hairline separator).
 */

import * as React from "react";
import { View } from "react-native";
import type { ViewProps, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type DividerProps = ViewProps & {
    /** Default 1 (vertical) — horizontal hairline. */
    orientation?: "horizontal" | "vertical";
    /** Default "md" — horizontal margin. */
    margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
    style?: ViewStyle | ViewStyle[];
};

export function Divider(props: DividerProps) {
    const { orientation = "horizontal", margin = "md", style, ...rest } = props;

    const { colors, tokens } = useSDSTheme();

    const dividerStyle: ViewStyle =
        orientation === "vertical"
            ? {
                  width: tokens.dimensions.hairline,
                  alignSelf: "stretch",
                  marginHorizontal: tokens.spacing[margin]
              }
            : {
                  height: tokens.dimensions.hairline,
                  alignSelf: "stretch",
                  marginVertical: tokens.spacing[margin]
              };

    return (
        <View
            {...rest}
            accessibilityRole="none"
            style={[dividerStyle, { backgroundColor: colors.border }, style]}
        />
    );
}

Divider.displayName = "Divider";

export default Divider;

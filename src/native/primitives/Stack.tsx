/**
 * SDS Native `Stack` layout primitive (flex column/row with consistent gaps).
 */

import * as React from "react";
import { View } from "react-native";
import type { ViewProps, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type StackProps = ViewProps & {
    /** Default "vertical". */
    direction?: "vertical" | "horizontal";
    /** Spacing scale step. Default "md". */
    spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    /** Default "flex-start". */
    align?: ViewStyle["alignItems"];
    /** Default "flex-start". */
    justify?: ViewStyle["justifyContent"];
    /** Allow children to grow. Default false. */
    flex?: boolean;
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
};

export function Stack(props: StackProps) {
    const {
        direction = "vertical",
        spacing = "md",
        align = "flex-start",
        justify = "flex-start",
        flex,
        children,
        style,
        ...rest
    } = props;

    const { tokens } = useSDSTheme();

    const gap = tokens.spacing[spacing];

    const stackStyle: ViewStyle = {
        flexDirection: direction === "horizontal" ? "row" : "column",
        alignItems: align,
        justifyContent: justify,
        gap,
        ...(flex ? { flex: 1 } : {})
    };

    return (
        <View {...rest} style={[stackStyle, style]}>
            {children}
        </View>
    );
}

Stack.displayName = "Stack";

export default Stack;

/**
 * SDS Native `Container` layout primitive (max-width + horizontal gutters).
 */

import * as React from "react";
import { View } from "react-native";
import type { ViewProps, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type ContainerProps = ViewProps & {
    /** Horizontal gutter. Default "md" spacing step. */
    gutter?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
};

export function Container(props: ContainerProps) {
    const { gutter = "md", children, style, ...rest } = props;

    const { tokens } = useSDSTheme();

    const containerStyle: ViewStyle = {
        width: "100%",
        paddingHorizontal: tokens.spacing[gutter],
        alignSelf: "center"
    };

    return (
        <View {...rest} style={[containerStyle, style]}>
            {children}
        </View>
    );
}

Container.displayName = "Container";

export default Container;

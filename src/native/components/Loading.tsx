/**
 * SDS Native `Loading` (activity indicator).
 */

import * as React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type LoadingProps = {
    /** Optional text shown next to / below the spinner. */
    label?: string;
    /** Default "md". */
    size?: "small" | "large";
    color?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Loading(props: LoadingProps) {
    const { label, size = "large", color, style, testID } = props;

    const { colors, tokens } = useSDSTheme();

    const spinnerSize = size === "large" ? "large" : "small";

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={label ?? "Chargement"}
            style={[
                {
                    alignItems: "center",
                    justifyContent: "center",
                    gap: tokens.spacing.sm,
                    padding: tokens.spacing.md
                },
                style
            ]}
        >
            <ActivityIndicator size={spinnerSize} color={color ?? colors.primary} />
            {label !== undefined && (
                <Text
                    style={{
                        color: colors.textMuted,
                        fontSize: tokens.typography["fontSize-sm"]
                    }}
                >
                    {label}
                </Text>
            )}
        </View>
    );
}

Loading.displayName = "Loading";

export default Loading;

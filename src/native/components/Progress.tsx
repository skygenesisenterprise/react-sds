/**
 * SDS Native `Progress` (progress bar).
 */

import * as React from "react";
import { View, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type ProgressProps = {
    /** Progress 0..100. */
    value: number;
    /** Default false — announce progress to assistive technologies. */
    showLabel?: boolean;
    accessibilityLabel?: string;
    /** Default "md". */
    size?: "sm" | "md";
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Progress(props: ProgressProps) {
    const {
        value,
        showLabel,
        accessibilityLabel,
        size = "md",
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const clamped = Math.max(0, Math.min(100, value));
    const height = size === "sm" ? 6 : 10;

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: clamped, text: `${Math.round(clamped)}%` }}
            accessibilityLabel={accessibilityLabel}
            style={[{ width: "100%", gap: tokens.spacing.xs }, style]}
        >
            <View
                style={{
                    width: "100%",
                    height,
                    borderRadius: tokens.radius.full,
                    backgroundColor: colors.surfaceMuted,
                    overflow: "hidden"
                }}
            >
                <View
                    style={{
                        width: `${clamped}%`,
                        height: "100%",
                        borderRadius: tokens.radius.full,
                        backgroundColor: colors.primary
                    }}
                />
            </View>
            {showLabel && (
                <Text
                    style={{
                        color: colors.textMuted,
                        fontSize: tokens.typography["fontSize-xs"]
                    }}
                >
                    {Math.round(clamped)}%
                </Text>
            )}
        </View>
    );
}

Progress.displayName = "Progress";

export default Progress;

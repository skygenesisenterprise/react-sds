/**
 * SDS Native `Badge`.
 */

import * as React from "react";
import { View, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import type { SDSColorToken } from "../tokens";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "primary";

export type BadgeProps = {
    children: React.ReactNode;
    /** Default "neutral". */
    tone?: BadgeTone;
    /** "solid" fills with the tone color, "soft" uses a muted background. Default "soft". */
    variant?: "soft" | "solid";
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

const TONE_COLOR: Record<BadgeTone, SDSColorToken> = {
    neutral: "muted",
    info: "info",
    success: "success",
    warning: "warning",
    error: "error",
    primary: "primary"
};

export function Badge(props: BadgeProps) {
    const {
        children,
        tone = "neutral",
        variant = "soft",
        accessibilityLabel,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const toneColor = TONE_COLOR[tone];
    const accent = colors[toneColor];

    const bg = variant === "solid" ? accent : colors.surfaceMuted;
    const fg = variant === "solid" ? (tone === "neutral" ? colors.onPrimary : colors.surface) : accent;

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole="text"
            accessibilityLabel={accessibilityLabel ?? (typeof children === "string" ? children : undefined)}
            style={[
                {
                    alignSelf: "flex-start",
                    paddingHorizontal: tokens.spacing.sm,
                    paddingVertical: 2,
                    borderRadius: tokens.radius.full,
                    backgroundColor: bg
                },
                style
            ]}
        >
            <Text
                style={{
                    color: fg,
                    fontSize: tokens.typography["fontSize-xs"],
                    fontWeight: tokens.typography["fontWeight-semibold"],
                    lineHeight: 18
                }}
            >
                {children}
            </Text>
        </View>
    );
}

Badge.displayName = "Badge";

export default Badge;

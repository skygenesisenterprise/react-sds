/**
 * SDS Native `Status` (dot + label indicator).
 */

import * as React from "react";
import { View, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import type { SDSColorToken } from "../tokens";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "error";

export type StatusProps = {
    children: React.ReactNode;
    /** Default "neutral". */
    tone?: StatusTone;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

const TONE_COLOR: Record<StatusTone, SDSColorToken> = {
    neutral: "muted",
    info: "info",
    success: "success",
    warning: "warning",
    error: "error"
};

export function Status(props: StatusProps) {
    const {
        children,
        tone = "neutral",
        accessibilityLabel,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const dotColor = colors[TONE_COLOR[tone]];

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole="text"
            accessibilityLabel={accessibilityLabel ?? (typeof children === "string" ? children : undefined)}
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: tokens.spacing.xs
                },
                style
            ]}
        >
            <View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: tokens.radius.full,
                    backgroundColor: dotColor
                }}
            />
            <Text
                style={{
                    color: colors.text,
                    fontSize: tokens.typography["fontSize-sm"],
                    fontWeight: tokens.typography["fontWeight-medium"]
                }}
            >
                {children}
            </Text>
        </View>
    );
}

Status.displayName = "Status";

export default Status;

/**
 * SDS Native `NotificationCard` — a generic notification entry.
 */

import * as React from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import type { SDSColorToken } from "../tokens";
import { Text, Icon } from "../primitives";
import { Card } from "./Card";

export type NotificationCardProps = {
    title: string;
    /** Notification body. */
    description?: string;
    /** ISO date or any short text shown as a timestamp. */
    timestamp?: string;
    /** Tone of the notification icon (default "info"). */
    tone?: "info" | "success" | "warning" | "error" | "neutral";
    /** Notification icon (default "notification"). */
    icon?: string;
    /** Default false. */
    unread?: boolean;
    onPress?: () => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

const TONE_COLOR: Record<NonNullable<NotificationCardProps["tone"]>, SDSColorToken> = {
    info: "info",
    success: "success",
    warning: "warning",
    error: "error",
    neutral: "muted"
};

export function NotificationCard(props: NotificationCardProps) {
    const {
        title,
        description,
        timestamp,
        tone = "info",
        icon = "notification",
        unread,
        onPress,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const accent = colors[TONE_COLOR[tone]];

    return (
        <Card
            testID={testID}
            onPress={onPress}
            bordered
            accessibilityLabel={accessibilityLabel ?? title}
            accessibilityHint={accessibilityHint}
            style={style}
        >
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: tokens.spacing.md }}>
                <View
                    style={{
                        width: tokens.dimensions.controlMd,
                        height: tokens.dimensions.controlMd,
                        borderRadius: tokens.radius.full,
                        backgroundColor: colors.surfaceMuted,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Icon name={icon} size={tokens.dimensions.iconMd} color={accent} />
                </View>
                <View style={{ flex: 1, gap: tokens.spacing.xs }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: tokens.spacing.xs }}>
                        {unread && (
                            <View
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: tokens.radius.full,
                                    backgroundColor: accent
                                }}
                            />
                        )}
                        <Text
                            numberOfLines={2}
                            style={{ flex: 1, fontWeight: tokens.typography["fontWeight-semibold"], color: colors.text }}
                        >
                            {title}
                        </Text>
                    </View>
                    {description !== undefined && <Text variant="bodySmall">{description}</Text>}
                    {timestamp !== undefined && <Text variant="caption">{timestamp}</Text>}
                </View>
            </View>
        </Card>
    );
}

NotificationCard.displayName = "NotificationCard";

export default NotificationCard;
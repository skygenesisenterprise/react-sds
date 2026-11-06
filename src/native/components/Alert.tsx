/**
 * SDS Native `Alert` (feedback banner).
 */

import * as React from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle, AccessibilityRole } from "react-native";
import { useSDSTheme } from "../theme";
import { Text, Icon } from "../primitives";

export type AlertSeverity = "info" | "success" | "warning" | "error";

export type AlertProps = {
    /** Default "info". */
    severity?: AlertSeverity;
    title?: string;
    children?: React.ReactNode;
    /** Default true — announced by assistive technologies. */
    role?: "alert" | "status";
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

const ICON_BY_SEVERITY: Record<AlertSeverity, string> = {
    info: "info",
    success: "success",
    warning: "warning",
    error: "alert"
};

export function Alert(props: AlertProps) {
    const {
        severity = "info",
        title,
        children,
        role = "alert",
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const accent = colors[severity];
    const bg = severity === "error" ? colors.surfaceMuted : colors.surfaceMuted;

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole={role as AccessibilityRole}
            accessibilityLabel={title !== undefined ? String(title) : undefined}
            style={[
                {
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: tokens.spacing.sm,
                    backgroundColor: bg,
                    borderLeftWidth: 4,
                    borderLeftColor: accent,
                    borderRadius: tokens.radius.sm,
                    padding: tokens.spacing.md
                },
                style
            ]}
        >
            <View style={{ marginTop: 2 }}>
                <Icon name={ICON_BY_SEVERITY[severity]} size={tokens.dimensions.iconSm} color={accent} />
            </View>
            <View style={{ flex: 1, gap: tokens.spacing.xs }}>
                {title !== undefined && (
                    <Text
                        style={{
                            fontWeight: tokens.typography["fontWeight-semibold"],
                            color: colors.text
                        }}
                    >
                        {title}
                    </Text>
                )}
                {children !== undefined && (
                    <Text variant="bodySmall">{children}</Text>
                )}
            </View>
        </View>
    );
}

Alert.displayName = "Alert";

export default Alert;

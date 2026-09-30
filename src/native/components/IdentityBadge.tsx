/**
 * SDS Native `IdentityBadge` — compact identity / trust label.
 *
 * Generic across government apps: renders a short label with an optional leading
 * icon. No MyGouv-specific logic.
 */

import * as React from "react";
import { View, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Icon } from "../primitives";

export type IdentityBadgeProps = {
    children: React.ReactNode;
    icon?: string;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function IdentityBadge(props: IdentityBadgeProps) {
    const { children, icon, accessibilityLabel, style, testID } = props;

    const { colors, tokens } = useSDSTheme();

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
                    gap: tokens.spacing.xs,
                    paddingHorizontal: tokens.spacing.sm,
                    paddingVertical: 4,
                    borderRadius: tokens.radius.full,
                    backgroundColor: colors.surfaceMuted,
                    borderWidth: tokens.dimensions.hairline,
                    borderColor: colors.border,
                    alignSelf: "flex-start"
                },
                style
            ]}
        >
            {icon !== undefined && <Icon name={icon} size={tokens.dimensions.iconSm} color={colors.primary} />}
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

IdentityBadge.displayName = "IdentityBadge";

export default IdentityBadge;

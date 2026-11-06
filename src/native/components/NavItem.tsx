/**
 * SDS Native `NavItem` — a navigation item (tab / nav row).
 *
 * A graphical primitive only: actual navigation is delegated to the host app via
 * `onPress` (SDS is not a router).
 */

import * as React from "react";
import { Pressable, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Icon } from "../primitives";

export type NavItemProps = {
    label: string;
    icon?: string;
    /** Active state styling (default false). */
    active?: boolean;
    onPress?: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    /** Default "tile" (tab-like). */
    variant?: "tile" | "row";
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function NavItem(props: NavItemProps) {
    const {
        label,
        icon,
        active,
        onPress,
        disabled,
        accessibilityLabel,
        accessibilityHint,
        variant = "tile",
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const isActive = active === true;
    const isDisabled = disabled === true;

    const fg = isActive ? colors.primary : isDisabled ? colors.disabled : colors.textMuted;

    const base: ViewStyle =
        variant === "tile"
            ? {
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: tokens.dimensions.controlLg,
                  paddingHorizontal: tokens.spacing.md,
                  borderRadius: tokens.radius.md,
                  backgroundColor: isActive ? colors.surfaceMuted : "transparent",
                  flexDirection: "row",
                  gap: tokens.spacing.xs
              }
            : {
                  flexDirection: "row",
                  alignItems: "center",
                  minHeight: tokens.dimensions.controlMd,
                  paddingVertical: tokens.spacing.sm,
                  gap: tokens.spacing.sm
              };

    return (
        <Pressable
            testID={testID}
            onPress={onPress}
            disabled={isDisabled}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled: isDisabled }}
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            style={({ pressed }) => [base, { opacity: pressed ? 0.8 : 1 }, style]}
        >
            {icon !== undefined && <Icon name={icon} size={tokens.dimensions.iconSm} color={fg} />}
            <Text
                numberOfLines={1}
                style={{
                    color: fg,
                    fontSize: tokens.typography["fontSize-sm"],
                    fontWeight: isActive ? tokens.typography["fontWeight-semibold"] : "400"
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
}

NavItem.displayName = "NavItem";

export default NavItem;

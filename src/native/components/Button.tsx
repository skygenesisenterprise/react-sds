/**
 * SDS Native `Button`.
 */

import * as React from "react";
import { Pressable, ActivityIndicator, View } from "react-native";
import type { StyleProp, ViewStyle, TextStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Text, Icon } from "../primitives";

export type ButtonPriority = "primary" | "secondary" | "tertiary";
export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = {
    children: React.ReactNode;
    /** Default "primary". */
    priority?: ButtonPriority;
    /** Default "medium". */
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    /** Icon name rendered next to the label. */
    icon?: string;
    /** Default "left". */
    iconPosition?: "left" | "right";
    /** Accessibility label. Defaults to the (string) children. */
    accessibilityLabel?: string;
    accessibilityHint?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Button(props: ButtonProps) {
    const {
        children,
        priority = "primary",
        size = "medium",
        disabled,
        loading,
        icon,
        iconPosition = "left",
        accessibilityLabel,
        accessibilityHint,
        onPress,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const isDisabled = disabled || loading;

    const height =
        size === "small"
            ? tokens.dimensions.controlSm
            : size === "medium"
              ? tokens.dimensions.controlMd
              : tokens.dimensions.controlLg;

    const paddingHorizontal = tokens.spacing[icon ? "md" : "lg"];

    const bg =
        priority === "primary"
            ? colors.primary
            : priority === "secondary"
              ? colors.secondary
              : "transparent";

    const fg =
        priority === "primary"
            ? colors.onPrimary
            : priority === "secondary"
              ? colors.primary
              : colors.primary;

    const border =
        priority === "tertiary"
            ? { borderWidth: 1, borderColor: colors.border }
            : priority === "secondary"
              ? { borderWidth: 1, borderColor: colors.border }
              : undefined;

    const label: string = typeof children === "string" ? children : accessibilityLabel ?? "";

    return (
        <Pressable
            testID={testID}
            onPress={onPress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: isDisabled, busy: loading === true }}
            android_ripple={priority === "primary" ? { color: "rgba(255,255,255,0.2)" } : undefined}
            style={({ pressed }) => [
                {
                    height,
                    minHeight: tokens.dimensions.touchTarget,
                    paddingHorizontal,
                    borderRadius: tokens.radius.md,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: tokens.spacing.sm,
                    backgroundColor: bg,
                    opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1
                },
                border,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={fg}
                    accessibilityLabel="Chargement"
                />
            ) : (
                <>
                    {icon !== undefined && iconPosition === "left" && (
                        <Icon name={icon} size={tokens.dimensions.iconSm} color={fg} />
                    )}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text
                            style={[
                                labelStyle(fg, size),
                                ...(size === "large"
                                    ? [{ fontWeight: tokens.typography["fontWeight-bold"] }]
                                    : [])
                            ]}
                        >
                            {children}
                        </Text>
                    </View>
                    {icon !== undefined && iconPosition === "right" && (
                        <Icon name={icon} size={tokens.dimensions.iconSm} color={fg} />
                    )}
                </>
            )}
        </Pressable>
    );
}

function labelStyle(color: string, size: ButtonSize): TextStyle {
    return {
        color,
        fontSize: size === "small" ? 14 : 16,
        fontWeight: "600"
    };
}

Button.displayName = "Button";

export default Button;

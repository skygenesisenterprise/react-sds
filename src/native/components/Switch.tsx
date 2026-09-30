/**
 * SDS Native `Switch` (toggle).
 *
 * Wraps the native React Native `Switch` with SDS theming and a guaranteed touch
 * target for accessibility.
 */

import * as React from "react";
import { Pressable, Switch as RNSwitch, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type SwitchProps = {
    value: boolean;
    onValueChange?: (value: boolean) => void;
    label?: React.ReactNode;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Switch(props: SwitchProps) {
    const {
        value,
        onValueChange,
        label,
        disabled,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const isDisabled = disabled === true;

    const textLabel: string = typeof label === "string" ? label : accessibilityLabel ?? "";

    const control = (
        <RNSwitch
            value={value}
            onValueChange={onValueChange}
            disabled={isDisabled}
            trackColor={{ true: colors.primary, false: isDisabled ? colors.disabled : colors.input }}
            thumbColor={colors.surface}
            ios_backgroundColor={isDisabled ? colors.disabled : colors.input}
        />
    );

    if (label === undefined) {
        return (
            <Pressable
                testID={testID}
                onPress={() => !isDisabled && onValueChange?.(!value)}
                disabled={isDisabled}
                accessibilityRole="switch"
                accessibilityState={{ checked: value, disabled: isDisabled }}
                accessibilityLabel={accessibilityLabel ?? textLabel}
                accessibilityHint={accessibilityHint}
                hitSlop={8}
                style={[{ minHeight: tokens.dimensions.touchTarget, justifyContent: "center" }, style]}
            >
                {control}
            </Pressable>
        );
    }

    return (
        <Pressable
            testID={testID}
            onPress={() => !isDisabled && onValueChange?.(!value)}
            disabled={isDisabled}
            accessibilityRole="switch"
            accessibilityState={{ checked: value, disabled: isDisabled }}
            accessibilityLabel={accessibilityLabel ?? textLabel}
            accessibilityHint={accessibilityHint}
            style={({ pressed }) => [
                {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: tokens.dimensions.touchTarget,
                    opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
                    gap: tokens.spacing.md
                },
                style
            ]}
        >
            <Text
                style={{
                    color: isDisabled ? colors.disabled : colors.text,
                    fontSize: tokens.typography["fontSize-md"],
                    flexShrink: 1
                }}
            >
                {label}
            </Text>
            {control}
        </Pressable>
    );
}

Switch.displayName = "Switch";

export default Switch;

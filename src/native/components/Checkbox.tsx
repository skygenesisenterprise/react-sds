/**
 * SDS Native `Checkbox`.
 */

import * as React from "react";
import { Pressable, View, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type CheckboxProps = {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Checkbox(props: CheckboxProps) {
    const {
        checked,
        onChange,
        label,
        disabled,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const isDisabled = disabled === true;

    const boxSize = tokens.dimensions.controlSm;

    const boxBg = checked ? colors.primary : colors.surface;
    const boxBorder = checked ? colors.primary : isDisabled ? colors.disabled : colors.input;

    const textLabel: string =
        typeof label === "string" ? label : accessibilityLabel ?? "";

    return (
        <Pressable
            testID={testID}
            onPress={() => !isDisabled && onChange?.(!checked)}
            disabled={isDisabled}
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled: isDisabled }}
            accessibilityLabel={accessibilityLabel ?? textLabel}
            accessibilityHint={accessibilityHint}
            style={({ pressed }) => [
                {
                    flexDirection: "row",
                    alignItems: "center",
                    minHeight: tokens.dimensions.touchTarget,
                    opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
                    gap: tokens.spacing.sm
                },
                style
            ]}
        >
            <View
                style={{
                    width: boxSize,
                    height: boxSize,
                    borderRadius: tokens.radius.sm,
                    borderWidth: 2,
                    borderColor: boxBorder,
                    backgroundColor: boxBg,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {checked && (
                    <Text style={{ color: colors.onPrimary, fontSize: 16, lineHeight: 18, fontWeight: "700" }}>
                        ✓
                    </Text>
                )}
            </View>
            {label !== undefined && (
                <Text
                    style={{
                        color: isDisabled ? colors.disabled : colors.text,
                        fontSize: tokens.typography["fontSize-md"],
                        flexShrink: 1
                    }}
                >
                    {label}
                </Text>
            )}
        </Pressable>
    );
}

Checkbox.displayName = "Checkbox";

export default Checkbox;

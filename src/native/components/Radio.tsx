/**
 * SDS Native `Radio` (single option).
 *
 * Prefer `<RadioGroup>` for managing a set of options; `Radio` is the building
 * block and can be used standalone with `selected`/`onSelect`.
 */

import * as React from "react";
import { Pressable, View, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type RadioProps = {
    selected: boolean;
    onSelect?: () => void;
    label?: React.ReactNode;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Radio(props: RadioProps) {
    const {
        selected,
        onSelect,
        label,
        disabled,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const isDisabled = disabled === true;

    const size = tokens.dimensions.controlSm;

    const textLabel: string = typeof label === "string" ? label : accessibilityLabel ?? "";

    return (
        <Pressable
            testID={testID}
            onPress={() => !isDisabled && onSelect?.()}
            disabled={isDisabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled: isDisabled }}
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
                    width: size,
                    height: size,
                    borderRadius: tokens.radius.full,
                    borderWidth: 2,
                    borderColor: selected ? colors.primary : isDisabled ? colors.disabled : colors.input,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {selected && (
                    <View
                        style={{
                            width: size / 2,
                            height: size / 2,
                            borderRadius: tokens.radius.full,
                            backgroundColor: colors.primary
                        }}
                    />
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

Radio.displayName = "Radio";

export default Radio;

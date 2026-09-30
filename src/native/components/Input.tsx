/**
 * SDS Native `Input` (form text field).
 */

import * as React from "react";
import { TextInput, View, Text } from "react-native";
import type { TextInputProps, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type InputProps = Omit<TextInputProps, "style"> & {
    label?: string;
    /** Shown below the field. */
    helperText?: string;
    /** Shown below the field when invalid (overrides helper). */
    error?: string;
    disabled?: boolean;
    style?: ViewStyle | ViewStyle[];
};

export function Input(props: InputProps) {
    const {
        label,
        helperText,
        error,
        disabled,
        editable = true,
        placeholderTextColor: placeholderTextColorProp,
        style,
        ...rest
    } = props;

    const { colors, tokens } = useSDSTheme();

    const isDisabled = disabled || !editable;

    const borderColor = error ? colors.error : isDisabled ? colors.disabled : colors.input;

    return (
        <View style={[{ width: "100%" }, style]}>
            {label !== undefined && (
                <Text
                    accessibilityRole="text"
                    style={{
                        color: colors.text,
                        fontSize: tokens.typography["fontSize-sm"],
                        fontWeight: tokens.typography["fontWeight-medium"],
                        marginBottom: tokens.spacing.xs
                    }}
                >
                    {label}
                </Text>
            )}
            <TextInput
                {...rest}
                editable={!isDisabled}
                placeholderTextColor={
                    placeholderTextColorProp ?? (isDisabled ? colors.disabled : colors.muted)
                }
                style={[
                    {
                        height: tokens.dimensions.controlMd,
                        minHeight: tokens.dimensions.controlMd,
                        paddingHorizontal: tokens.spacing.md,
                        borderWidth: 1,
                        borderColor,
                        borderRadius: tokens.radius.sm,
                        backgroundColor: colors.surface,
                        color: isDisabled ? colors.disabled : colors.text,
                        fontSize: tokens.typography["fontSize-md"]
                    },
                    rest.multiline === true && {
                        height: undefined,
                        minHeight: tokens.dimensions.controlLg * 2,
                        paddingVertical: tokens.spacing.sm,
                        textAlignVertical: "top"
                    }
                ]}
            />
            {error !== undefined ? (
                <Text
                    accessibilityRole="alert"
                    style={{
                        color: colors.error,
                        fontSize: tokens.typography["fontSize-xs"],
                        marginTop: tokens.spacing.xs
                    }}
                >
                    {error}
                </Text>
            ) : helperText !== undefined ? (
                <Text
                    style={{
                        color: colors.textMuted,
                        fontSize: tokens.typography["fontSize-xs"],
                        marginTop: tokens.spacing.xs
                    }}
                >
                    {helperText}
                </Text>
            ) : null}
        </View>
    );
}

Input.displayName = "Input";

export default Input;

/**
 * SDS Native `Select`.
 *
 * React Native has no native `<select>`. SDS provides a dependency-light,
 * accessible picker built on the native `Modal` + list primitives.
 */

import * as React from "react";
import { Pressable, View, Text, Modal, FlatList, TouchableOpacity } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Icon } from "../primitives";

export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

export type SelectProps = {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Select(props: SelectProps) {
    const {
        options,
        value,
        onChange,
        placeholder,
        label,
        disabled,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const [open, setOpen] = React.useState(false);

    const isDisabled = disabled === true;

    const selected = options.find(option => option.value === value);

    const fieldLabel = accessibilityLabel ?? label ?? placeholder ?? "";

    return (
        <View style={[{ width: "100%" }, style]}>
            {label !== undefined && (
                <Text
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
            <Pressable
                testID={testID}
                onPress={() => !isDisabled && setOpen(true)}
                disabled={isDisabled}
                accessibilityRole="button"
                accessibilityLabel={fieldLabel}
                accessibilityHint={accessibilityHint}
                accessibilityState={{ disabled: isDisabled, expanded: open }}
                style={({ pressed }) => [
                    {
                        height: tokens.dimensions.controlMd,
                        paddingHorizontal: tokens.spacing.md,
                        borderWidth: 1,
                        borderColor: isDisabled ? colors.disabled : colors.input,
                        borderRadius: tokens.radius.sm,
                        backgroundColor: colors.surface,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1
                    }
                ]}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        color: selected ? colors.text : isDisabled ? colors.disabled : colors.muted,
                        fontSize: tokens.typography["fontSize-md"],
                        flexShrink: 1
                    }}
                >
                    {selected ? selected.label : placeholder ?? "Sélectionner…"}
                </Text>
                <Icon name="chevron-down" size={tokens.dimensions.iconSm} color={colors.muted} />
            </Pressable>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center" }}
                    onPress={() => setOpen(false)}
                >
                    <Pressable
                        onPress={() => undefined}
                        style={{
                            marginHorizontal: tokens.spacing.lg,
                            backgroundColor: colors.surface,
                            borderRadius: tokens.radius.lg,
                            maxHeight: "70%",
                            paddingVertical: tokens.spacing.sm
                        }}
                    >
                        <Text
                            style={{
                                color: colors.textMuted,
                                fontSize: tokens.typography["fontSize-sm"],
                                paddingHorizontal: tokens.spacing.md,
                                paddingBottom: tokens.spacing.sm
                            }}
                        >
                            {label ?? placeholder}
                        </Text>
                        <FlatList
                            data={options}
                            keyExtractor={option => option.value}
                            renderItem={({ item }) => {
                                const isSelected = item.value === value;
                                return (
                                    <TouchableOpacity
                                        disabled={item.disabled}
                                        onPress={() => {
                                            onChange?.(item.value);
                                            setOpen(false);
                                        }}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected: isSelected, disabled: item.disabled === true }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            paddingHorizontal: tokens.spacing.md,
                                            paddingVertical: tokens.spacing.md,
                                            minHeight: tokens.dimensions.controlMd,
                                            backgroundColor: isSelected ? colors.surfaceMuted : "transparent",
                                            opacity: item.disabled ? 0.5 : 1
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontSize: tokens.typography["fontSize-md"],
                                                fontWeight: isSelected ? tokens.typography["fontWeight-semibold"] : "400",
                                                flexShrink: 1
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                        {isSelected && (
                                            <Icon name="check" size={tokens.dimensions.iconSm} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

Select.displayName = "Select";

export default Select;

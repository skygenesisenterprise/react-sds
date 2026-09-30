/**
 * SDS Native `RadioGroup`.
 */

import * as React from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Radio } from "./Radio";

export type RadioOption<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
};

export type RadioGroupProps<T extends string = string> = {
    options: RadioOption<T>[];
    value: T;
    onChange?: (value: T) => void;
    disabled?: boolean;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function RadioGroup<T extends string = string>(props: RadioGroupProps<T>) {
    const {
        options,
        value,
        onChange,
        disabled,
        accessibilityLabel,
        style,
        testID
    } = props;

    const { tokens } = useSDSTheme();

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole="radiogroup"
            accessibilityLabel={accessibilityLabel}
            style={[{ gap: tokens.dimensions.controlGap }, style]}
        >
            {options.map(option => (
                <Radio
                    key={option.value}
                    selected={value === option.value}
                    onSelect={() => onChange?.(option.value)}
                    label={option.label}
                    disabled={disabled || option.disabled}
                />
            ))}
        </View>
    );
}

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;

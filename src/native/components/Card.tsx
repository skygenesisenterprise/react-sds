/**
 * SDS Native `Card` (surface container).
 */

import * as React from "react";
import { View, Pressable } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { elevationToStyle } from "../utils";

export type CardProps = {
    children: React.ReactNode;
    /** Default false — no elevation. */
    elevated?: boolean;
    /** Default false. */
    bordered?: boolean;
    /** Default false — makes the whole card tappable. */
    onPress?: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Card(props: CardProps) {
    const {
        children,
        elevated,
        bordered,
        onPress,
        disabled,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const cardStyle: ViewStyle = {
        backgroundColor: colors.surface,
        borderRadius: tokens.radius.lg,
        padding: tokens.dimensions.cardPadding,
        ...(bordered ? { borderWidth: 1, borderColor: colors.border } : {}),
        ...(elevated ? elevationToStyle(tokens.elevation.md) : {})
    };

    if (onPress !== undefined) {
        return (
            <Pressable
                testID={testID}
                onPress={onPress}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityState={{ disabled: disabled === true }}
                style={({ pressed }) => [
                    cardStyle,
                    { opacity: pressed ? 0.9 : 1 },
                    style
                ]}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View testID={testID} style={[cardStyle, style]}>
            {children}
        </View>
    );
}

Card.displayName = "Card";

export default Card;

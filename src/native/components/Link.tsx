/**
 * SDS Native `Link`.
 *
 * A tappable text styled as a link. The actual navigation is delegated to the
 * host application via `onPress` (SDS provides the graphical primitive, not a
 * router). Use `Linking.openURL` or your router in `onPress`.
 */

import * as React from "react";
import { Pressable } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Text } from "../primitives";

export type LinkProps = {
    children: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Link(props: LinkProps) {
    const {
        children,
        onPress,
        disabled,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const label: string = typeof children === "string" ? children : accessibilityLabel ?? "";

    return (
        <Pressable
            testID={testID}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="link"
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: disabled === true }}
            hitSlop={8}
            style={({ pressed }) => [
                {
                    minHeight: tokens.dimensions.controlSm,
                    justifyContent: "center",
                    opacity: disabled ? 0.5 : pressed ? 0.7 : 1
                },
                style
            ]}
        >
            <Text style={{ color: disabled ? colors.disabled : colors.link }}>{children}</Text>
        </Pressable>
    );
}

Link.displayName = "Link";

export default Link;

/**
 * SDS Native `IconButton`.
 */

import * as React from "react";
import { Pressable } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Icon } from "../primitives";

export type IconButtonProps = {
    /** Icon name. */
    icon: string;
    /** Accessibility label — required for icon-only controls. */
    accessibilityLabel: string;
    accessibilityHint?: string;
    disabled?: boolean;
    /** Icon size. Default "md". */
    size?: number;
    color?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function IconButton(props: IconButtonProps) {
    const {
        icon,
        accessibilityLabel,
        accessibilityHint,
        disabled,
        size,
        color,
        onPress,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const iconSize = size ?? tokens.dimensions.iconMd;
    const target = tokens.dimensions.touchTarget;

    return (
        <Pressable
            testID={testID}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: disabled === true }}
            hitSlop={Math.max(0, (target - iconSize - 8) / 2)}
            style={({ pressed }) => [
                {
                    width: target,
                    height: target,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: tokens.radius.full,
                    opacity: disabled ? 0.5 : pressed ? 0.7 : 1
                },
                style
            ]}
        >
            <Icon name={icon} size={iconSize} color={color ?? colors.foreground} />
        </Pressable>
    );
}

IconButton.displayName = "IconButton";

export default IconButton;

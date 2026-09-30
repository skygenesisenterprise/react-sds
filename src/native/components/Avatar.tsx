/**
 * SDS Native `Avatar`.
 */

import * as React from "react";
import { View, Image, Text } from "react-native";
import type { StyleProp, ViewStyle, ImageSourcePropType, ImageStyle } from "react-native";
import { useSDSTheme } from "../theme";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarProps = {
    /** Image source. When omitted, initials are rendered on a muted surface. */
    source?: ImageSourcePropType;
    /** Name used to derive initials when no image is shown. */
    name?: string;
    /** Default "md". */
    size?: AvatarSize;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    testID?: string;
};

const SIZE: Record<AvatarSize, number> = {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 88
};

export function Avatar(props: AvatarProps) {
    const {
        source,
        name,
        size = "md",
        accessibilityLabel,
        style,
        imageStyle,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const px = SIZE[size];

    const initials = initialsFrom(name);

    const label = accessibilityLabel ?? name ?? "";

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole="image"
            accessibilityLabel={label}
            style={[
                {
                    width: px,
                    height: px,
                    borderRadius: tokens.radius.full,
                    backgroundColor: colors.surfaceMuted,
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                },
                style
            ]}
        >
            {source !== undefined ? (
                <Image
                    source={source}
                    style={[{ width: px, height: px, borderRadius: tokens.radius.full }, imageStyle]}
                />
            ) : (
                <Text
                    style={{
                        color: colors.primary,
                        fontSize: px * 0.4,
                        fontWeight: tokens.typography["fontWeight-semibold"]
                    }}
                >
                    {initials}
                </Text>
            )}
        </View>
    );
}

function initialsFrom(name?: string): string {
    if (name === undefined || name.trim() === "") {
        return "?";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

Avatar.displayName = "Avatar";

export default Avatar;

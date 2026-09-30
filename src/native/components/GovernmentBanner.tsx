/**
 * SDS Native `GovernmentBanner` — institutional banner of the Sky Genesis Enterprise.
 *
 * Renders the government identity as a graphical banner. Content is provided by
 * the host app (no hard-coded ministry logic).
 */

import * as React from "react";
import { View, Text } from "react-native";
import type { StyleProp, ViewStyle, ImageSourcePropType, ImageStyle } from "react-native";
import { Image } from "react-native";
import { useSDSTheme } from "../theme";

export type GovernmentBannerProps = {
    /** Flag/emblem lockup image source. */
    image?: ImageSourcePropType;
    /** Institution name, e.g. "Gouvernement" or "République d'SGE". */
    institution: string;
    /** Sub-label, e.g. "Liberté · Égalité · Prospérité". */
    tagline?: string;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    testID?: string;
};

export function GovernmentBanner(props: GovernmentBannerProps) {
    const {
        image,
        institution,
        tagline,
        accessibilityLabel,
        style,
        imageStyle,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    return (
        <View
            testID={testID}
            accessible
            accessibilityLabel={accessibilityLabel ?? institution}
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: tokens.spacing.sm,
                    backgroundColor: colors.primary,
                    paddingHorizontal: tokens.dimensions.contentGutter,
                    paddingVertical: tokens.spacing.sm,
                    minHeight: tokens.dimensions.controlLg + tokens.spacing.sm
                },
                style
            ]}
        >
            {image !== undefined && (
                <Image
                    source={image}
                    resizeMode="contain"
                    style={[{ width: 64, height: 32 }, imageStyle]}
                />
            )}
            <View style={{ flex: 1 }}>
                <Text
                    numberOfLines={1}
                    style={{
                        color: colors.onPrimary,
                        fontSize: tokens.typography["fontSize-sm"],
                        fontWeight: tokens.typography["fontWeight-bold"]
                    }}
                >
                    {institution}
                </Text>
                {tagline !== undefined && (
                    <Text
                        numberOfLines={1}
                        style={{
                            color: colors.onPrimary,
                            opacity: 0.85,
                            fontSize: tokens.typography["fontSize-xs"]
                        }}
                    >
                        {tagline}
                    </Text>
                )}
            </View>
        </View>
    );
}

GovernmentBanner.displayName = "GovernmentBanner";

export default GovernmentBanner;
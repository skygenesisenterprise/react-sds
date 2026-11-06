/**
 * SDS Native `Header` — a mobile app header bar.
 *
 * A graphical primitive (title + optional leading/trailing actions). Navigation
 * is delegated to the host app via `onBack` / `onPress`.
 */

import * as React from "react";
import { View, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { IconButton } from "./IconButton";

export type HeaderProps = {
    title: string;
    /** Back button. When provided, a back chevron is rendered on the left. */
    onBack?: () => void;
    backLabel?: string;
    /** Leading action (usually the left icon when not using a back button). */
    leading?: React.ReactNode;
    /** Trailing action(s). */
    trailing?: React.ReactNode;
    subtitle?: string;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Header(props: HeaderProps) {
    const {
        title,
        onBack,
        backLabel,
        leading,
        trailing,
        subtitle,
        accessibilityLabel,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    return (
        <View
            testID={testID}
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    minHeight: tokens.dimensions.controlLg + tokens.spacing.sm,
                    paddingHorizontal: tokens.dimensions.contentGutter,
                    backgroundColor: colors.surface,
                    borderBottomWidth: tokens.dimensions.hairline,
                    borderBottomColor: colors.border
                },
                style
            ]}
        >
            <View style={{ width: tokens.dimensions.touchTarget, alignItems: "flex-start" }}>
                {leading !== undefined
                    ? leading
                    : onBack !== undefined && (
                          <IconButton
                              icon="arrowLeft"
                              accessibilityLabel={backLabel ?? "Retour"}
                              onPress={onBack}
                          />
                      )}
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text
                    numberOfLines={1}
                    accessibilityRole="header"
                    accessibilityLabel={accessibilityLabel ?? title}
                    style={{
                        color: colors.foreground,
                        fontSize: tokens.typography["fontSize-md"],
                        fontWeight: tokens.typography["fontWeight-semibold"]
                    }}
                >
                    {title}
                </Text>
                {subtitle !== undefined && (
                    <Text
                        numberOfLines={1}
                        style={{
                            color: colors.textMuted,
                            fontSize: tokens.typography["fontSize-xs"]
                        }}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>
            <View
                style={{
                    width: tokens.dimensions.touchTarget,
                    alignItems: "flex-end",
                    flexDirection: "row",
                    justifyContent: "flex-end"
                }}
            >
                {trailing}
            </View>
        </View>
    );
}

Header.displayName = "Header";

export default Header;

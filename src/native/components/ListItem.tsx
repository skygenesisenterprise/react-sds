/**
 * SDS Native `ListItem` (a row within a `List`).
 */

import * as React from "react";
import { View, Pressable } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Text } from "../primitives";
import { Icon } from "../primitives";

export type ListItemProps = {
    /** Primary text. */
    title?: React.ReactNode;
    /** Secondary text under the title. */
    description?: React.ReactNode;
    /** Leading element (icon, avatar, thumbnail…). */
    leading?: React.ReactNode;
    /** Trailing element (chevron, badge, switch…). */
    trailing?: React.ReactNode;
    /** Makes the row tappable. */
    onPress?: () => void;
    disabled?: boolean;
    /** Renders a chevron in the trailing slot when true and no `trailing` given. */
    showChevron?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function ListItem(props: ListItemProps) {
    const {
        title,
        description,
        leading,
        trailing,
        onPress,
        disabled,
        showChevron,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    const isDisabled = disabled === true;

    const label =
        accessibilityLabel ??
        (typeof title === "string" ? title : undefined);

    const content = (
        <>
            {leading !== undefined && (
                <View style={{ marginRight: tokens.spacing.md, justifyContent: "center" }}>
                    {leading}
                </View>
            )}
            <View style={{ flex: 1, justifyContent: "center" }}>
                {title !== undefined && (
                    <Text
                        numberOfLines={2}
                        style={{
                            color: isDisabled ? colors.disabled : colors.text,
                            fontWeight: tokens.typography["fontWeight-medium"]
                        }}
                    >
                        {title}
                    </Text>
                )}
                {description !== undefined && (
                    <Text variant="bodySmall" style={{ marginTop: tokens.spacing.xs / 2 }}>
                        {description}
                    </Text>
                )}
            </View>
            {trailing !== undefined && (
                <View style={{ marginLeft: tokens.spacing.md, justifyContent: "center" }}>
                    {trailing}
                </View>
            )}
            {trailing === undefined && showChevron && (
                <View style={{ marginLeft: tokens.spacing.md, justifyContent: "center" }}>
                    <Icon name="chevron-right" size={tokens.dimensions.iconSm} color={colors.muted} />
                </View>
            )}
        </>
    );

    const rowStyle: ViewStyle = {
        flexDirection: "row",
        alignItems: "stretch",
        minHeight: tokens.dimensions.controlLg,
        paddingVertical: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.sm
    };

    if (onPress !== undefined) {
        return (
            <Pressable
                testID={testID}
                onPress={onPress}
                disabled={isDisabled}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityHint={accessibilityHint}
                accessibilityState={{ disabled: isDisabled }}
                style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.85 : 1 }, style]}
            >
                {content}
            </Pressable>
        );
    }

    return (
        <View testID={testID} style={[rowStyle, style]}>
            {content}
        </View>
    );
}

ListItem.displayName = "ListItem";

export default ListItem;

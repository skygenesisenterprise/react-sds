/**
 * SDS Native `List` (vertical list of rows).
 *
 * A thin, theme-aware wrapper over `FlatList` with an optional section header.
 */

import * as React from "react";
import { FlatList, View, Text } from "react-native";
import type { FlatListProps, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Divider } from "../primitives";

export type ListProps<T> = Omit<
    FlatListProps<T>,
    "style" | "ItemSeparatorComponent"
> & {
    /** Optional section title rendered above the list. */
    title?: string;
    /** Default true — hairline separators between rows. */
    divided?: boolean;
    style?: ViewStyle | ViewStyle[];
    contentContainerStyle?: ViewStyle | ViewStyle[];
};

export function List<T>(props: ListProps<T>) {
    const { title, divided = true, style, contentContainerStyle, ...rest } = props;

    const { colors, tokens } = useSDSTheme();

    return (
        <View style={[{ width: "100%" }, style]}>
            {title !== undefined && (
                <Text
                    accessibilityRole="header"
                    style={{
                        color: colors.textMuted,
                        fontSize: tokens.typography["fontSize-sm"],
                        fontWeight: tokens.typography["fontWeight-semibold"],
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: tokens.spacing.xs
                    }}
                >
                    {title}
                </Text>
            )}
            <FlatList
                {...rest}
                scrollEnabled={false}
                ItemSeparatorComponent={
                    divided
                        ? () => <Divider orientation="horizontal" margin="none" />
                        : undefined
                }
                contentContainerStyle={contentContainerStyle}
            />
        </View>
    );
}

List.displayName = "List";

export default List;

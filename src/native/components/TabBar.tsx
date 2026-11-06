/**
 * SDS Native `TabBar` — a horizontal bar of `NavItem`s (tab navigation).
 *
 * Graphical primitive only; routing is delegated to the host app.
 */

import * as React from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { NavItem } from "./NavItem";

export type Tab = {
    key: string;
    label: string;
    icon?: string;
    disabled?: boolean;
};

export type TabBarProps = {
    tabs: Tab[];
    /** Active tab key. */
    value: string;
    onSelect?: (key: string) => void;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function TabBar(props: TabBarProps) {
    const {
        tabs,
        value,
        onSelect,
        accessibilityLabel,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole="tablist"
            accessibilityLabel={accessibilityLabel}
            style={[
                {
                    flexDirection: "row",
                    backgroundColor: colors.surface,
                    borderBottomWidth: tokens.dimensions.hairline,
                    borderBottomColor: colors.border
                },
                style
            ]}
        >
            {tabs.map(tab => (
                <View key={tab.key} style={{ flex: 1 }}>
                    <NavItem
                        label={tab.label}
                        icon={tab.icon}
                        active={value === tab.key}
                        disabled={tab.disabled}
                        onPress={() => onSelect?.(tab.key)}
                    />
                </View>
            ))}
        </View>
    );
}

TabBar.displayName = "TabBar";

export default TabBar;

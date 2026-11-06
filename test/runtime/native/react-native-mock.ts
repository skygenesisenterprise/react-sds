/**
 * Minimal React Native mock used by SDS Native runtime tests.
 *
 * Renders native primitives as plain host elements so components can be
 * rendered with `react-dom/server` in the Node vitest environment. This mock
 * is ONLY used by the runtime tests — never shipped.
 */

import * as React from "react";
import { createElement } from "react";

function host(type: string) {
    const Host: React.FC<any> = (props: any) => {
        const { children, style: _style, ref: _ref, key: _key, ...rest } = props;

        const attrs: Record<string, string> = {};

        for (const [keyName, value] of Object.entries(rest)) {
            if (value === undefined || value === null || typeof value === "function") {
                continue;
            }

            attrs[keyName] =
                typeof value === "object" ? JSON.stringify(value) : String(value);
        }

        return createElement(type.toLowerCase(), attrs, children);
    };

    Host.displayName = type;

    return Host;
}

export const View = host("View");
export const Text = host("Text");
export const Pressable = host("Pressable");
export const TextInput = host("TextInput");
export const Switch = host("Switch");
export const Modal = host("Modal");
export const FlatList = host("FlatList");
export const ScrollView = host("ScrollView");
export const Image = host("Image");
export const TouchableOpacity = host("TouchableOpacity");
export const ActivityIndicator = host("ActivityIndicator");

export const Platform = {
    OS: "ios",
    select: (specifics: Record<string, unknown>) => specifics.ios
};

export const StyleSheet = {
    hairlineWidth: 1,
    create: <T,>(styles: T) => styles
};

export const useColorScheme = (): "light" | "dark" => "light";
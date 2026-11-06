/**
 * SDS Native `Icon` primitive.
 *
 * ```tsx
 * import { Icon } from "@skygenesisenterprise/react-sds/native";
 *
 * <Icon name="check" size={24} color={colors.success} />
 * ```
 *
 * The icon is rendered through the host application's icon system when the app
 * provides a `renderIcon` to `<SDSProvider>`. This is the recommended way to plug
 * a real icon font (e.g. `@expo/vector-icons`). Without a provider, or when the
 * provider does not set `renderIcon`, a small built-in set of semantic glyphs is
 * used so components always render.
 *
 * The native layer never depends on the web SVG/CSS icon system.
 */

import * as React from "react";
import { Text } from "react-native";
import type { TextProps, TextStyle } from "react-native";
import { useSDSTheme } from "../theme";

const BUILTIN_GLYPHS: Record<string, string> = {
    arrowLeft: "←",
    arrowRight: "→",
    check: "✓",
    close: "✕",
    info: "ℹ",
    warning: "⚠",
    alert: "⚠",
    success: "✓",
    error: "✕",
    menu: "☰",
    search: "⌕",
    "chevron-down": "⌄",
    "chevron-right": "›",
    home: "⌂",
    star: "★",
    user: "●",
    document: "▤",
    notification: "🔔",
    calendar: "📅",
    lock: "🔒",
    settings: "⚙",
    external: "↗",
    plus: "+",
    minus: "−",
    refresh: "⟳",
    send: "➤",
    heart: "♥",
    download: "↓",
    upload: "↑",
    share: "⇪",
    location: "◎"
};

export type IconProps = Omit<TextProps, "children"> & {
    /** SDS icon name. */
    name: string;
    /** Glyph size. Default "md" dimension step, or explicit number. */
    size?: number;
    /** Glyph color. Defaults to the current text color. */
    color?: string;
    /** Accessibility label. Defaults to a humanized `name`. */
    accessibilityLabel?: string;
    style?: TextStyle | TextStyle[];
};

export function Icon(props: IconProps) {
    const { name, size, color, accessibilityLabel, style, accessible, ...rest } = props;

    const { colors, tokens, renderIcon } = useSDSTheme();

    const iconSize = size ?? tokens.dimensions.iconMd;

    if (renderIcon !== undefined) {
        const node = renderIcon(name, iconSize, color ?? colors.foreground);

        return (
            <Text
                {...rest}
                accessible={accessible ?? true}
                accessibilityRole="image"
                accessibilityLabel={accessibilityLabel ?? humanize(name)}
                style={[{ width: iconSize, height: iconSize, alignItems: "center", justifyContent: "center" }, style]}
            >
                {node}
            </Text>
        );
    }

    const glyph = BUILTIN_GLYPHS[name] ?? "•";

    return (
        <Text
            {...rest}
            accessible={accessible ?? true}
            accessibilityRole="image"
            accessibilityLabel={accessibilityLabel ?? humanize(name)}
            style={[{ fontSize: iconSize, color: color ?? colors.foreground }, style]}
        >
            {glyph}
        </Text>
    );
}

function humanize(name: string): string {
    return name
        .replace(/[_-]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
}

Icon.displayName = "Icon";

export default Icon;

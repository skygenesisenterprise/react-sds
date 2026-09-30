/**
 * SDS Native theme context.
 */

import * as React from "react";
import type { SDSTokens } from "../tokens";

export type SDSColorScheme = "light" | "dark" | "system";

export type SDSTheme = {
    /** Resolved color scheme ("system" already resolved). */
    colorScheme: "light" | "dark";
    /** Effective color tokens for the current scheme. */
    colors: SDSTokens["colors"];
    tokens: SDSTokens;
    /** Override a single token at runtime. */
    setTokens: (override: Partial<SDSTokens>) => void;
    /** Set the color scheme. */
    setColorScheme: (scheme: SDSColorScheme) => void;
    /** Render an icon by name — overridable by the host app (see Icon). */
    renderIcon?: (name: string, size: number, color: string) => React.ReactNode;
};

export const SDSThemeContext = React.createContext<SDSTheme | undefined>(undefined);

export const SDS_ACCESSIBILITY_ERROR =
    "No SDSProvider found. Wrap your app in <SDSProvider> from @skygenesisenterprise/react-sds/native.";

export function useSDSThemeContext(): SDSTheme {
    const theme = React.useContext(SDSThemeContext);

    if (theme === undefined) {
        throw new Error(SDS_ACCESSIBILITY_ERROR);
    }

    return theme;
}

/**
 * `useSDSTheme` hook.
 *
 * Returns the active SDS Native theme. When rendered outside an `<SDSProvider>`
 * it returns a default theme so components still work out of the box.
 */

import * as React from "react";
import { useColorScheme } from "react-native";
import { sdsTokens as defaultTokens } from "../tokens";
import { SDSThemeContext, type SDSTheme } from "./context";

export type { SDSTheme, SDSColorScheme } from "./context";

export function useSDSTheme(): SDSTheme {
    const context = React.useContext(SDSThemeContext);

    const systemScheme = useColorScheme() ?? "light";

    if (context !== undefined) {
        return context;
    }

    return {
        colorScheme: systemScheme,
        colors: defaultTokens[systemScheme === "dark" ? "darkColors" : "colors"],
        tokens: defaultTokens,
        setTokens: () => {
            // No provider: token overrides are ignored (a provider is required to mutate).
        },
        setColorScheme: () => {
            // No provider: no-op.
        }
    };
}

export { defaultTokens as defaultSDSTokens };

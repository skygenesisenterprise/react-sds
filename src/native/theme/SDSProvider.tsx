/**
 * SDS Native theme provider.
 *
 * ```tsx
 * import { SDSProvider } from "@skygenesisenterprise/react-sds/native";
 *
 * <SDSProvider colorScheme="system">
 *   <App />
 * </SDSProvider>
 * ```
 */

import * as React from "react";
import { useColorScheme } from "react-native";
import { sdsTokens as defaultTokens } from "../tokens";
import type { SDSTokens } from "../tokens";
import { SDSThemeContext, type SDSColorScheme, type SDSTheme } from "./context";

export type { SDSColorScheme, SDSTheme } from "./context";

export type SDSProviderProps = {
    children: React.ReactNode;
    /** Default "system". */
    colorScheme?: SDSColorScheme;
    /** Partial token override (e.g. to supply the official SGE identity). */
    tokens?: Partial<SDSTokens>;
    /** Provide an icon renderer (see the Icon primitive). */
    renderIcon?: SDSTheme["renderIcon"];
};

export function SDSProvider(props: SDSProviderProps) {
    const { children, colorScheme = "system", tokens, renderIcon } = props;

    const systemScheme = useColorScheme() ?? "light";

    const [colorSchemeState, setColorSchemeState] = React.useState<SDSColorScheme>(colorScheme);

    const [tokenOverride, setTokenOverride] = React.useState<Partial<SDSTokens> | undefined>(
        tokens
    );

    React.useEffect(() => {
        setColorSchemeState(colorScheme);
    }, [colorScheme]);

    React.useEffect(() => {
        setTokenOverride(tokens);
    }, [tokens]);

    const resolvedScheme: "light" | "dark" =
        colorSchemeState === "system"
            ? systemScheme
            : colorSchemeState;

    const resolvedTokens: SDSTokens = React.useMemo(
        () => deepMergeTokens(defaultTokens, tokenOverride),
        [tokenOverride]
    );

    const theme: SDSTheme = React.useMemo(
        () => ({
            colorScheme: resolvedScheme,
            colors: resolvedTokens[resolvedScheme === "dark" ? "darkColors" : "colors"],
            tokens: resolvedTokens,
            setTokens: override =>
                setTokenOverride(prev => mergeTokenOverrides([prev ?? {}, override])),
            setColorScheme: setColorSchemeState,
            renderIcon
        }),
        [resolvedScheme, resolvedTokens, renderIcon]
    );

    return <SDSThemeContext.Provider value={theme}>{children}</SDSThemeContext.Provider>;
}

function deepMergeTokens(base: SDSTokens, override?: Partial<SDSTokens>): SDSTokens {
    if (override === undefined) {
        return base;
    }

    return {
        colors: { ...base.colors, ...override.colors },
        darkColors: { ...base.darkColors, ...override.darkColors },
        typography: { ...base.typography, ...override.typography },
        spacing: { ...base.spacing, ...override.spacing },
        radius: { ...base.radius, ...override.radius },
        elevation: { ...base.elevation, ...override.elevation },
        dimensions: { ...base.dimensions, ...override.dimensions },
        motion: { ...base.motion, ...override.motion }
    };
}

function mergeTokenOverrides(overrides: Partial<SDSTokens>[]): Partial<SDSTokens> {
    return overrides.reduce<Partial<SDSTokens>>(
        (acc, override) => ({
            ...acc,
            ...(override.colors !== undefined && { colors: { ...acc.colors, ...override.colors } }),
            ...(override.darkColors !== undefined && {
                darkColors: { ...acc.darkColors, ...override.darkColors }
            }),
            ...(override.typography !== undefined && {
                typography: { ...acc.typography, ...override.typography }
            }),
            ...(override.spacing !== undefined && {
                spacing: { ...acc.spacing, ...override.spacing }
            }),
            ...(override.radius !== undefined && { radius: { ...acc.radius, ...override.radius } }),
            ...(override.elevation !== undefined && {
                elevation: { ...acc.elevation, ...override.elevation }
            }),
            ...(override.dimensions !== undefined && {
                dimensions: { ...acc.dimensions, ...override.dimensions }
            }),
            ...(override.motion !== undefined && { motion: { ...acc.motion, ...override.motion } })
        }),
        {}
    );
}

SDSProvider.displayName = "SDSProvider";

export default SDSProvider;

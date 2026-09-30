import React from "react";
import type { ReactNode } from "react";

/**
 * Helpers for the "Foundations" Storybook page (stories/foundations.stories.mdx).
 * The galleries read the `--sds-*` custom properties from the live stylesheet
 * (`../dist/main.css` is imported by the page), so the shown values always match
 * the tokens actually loaded — light or dark scheme.
 */

const cssVariableNames: Record<string, string[]> = {
    "colors": [
        "background",
        "surface",
        "surface-muted",
        "foreground",
        "text-muted",
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "danger",
        "info",
        "border",
        "ring",
        "focus",
        "link",
        "link-hover",
        "on-primary",
        "disabled"
    ],
    "spacing": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    "radius": ["none", "sm", "md", "lg", "xl", "full"],
    "elevation": ["none", "small", "medium", "large"],
    "motion": [
        "duration-fast",
        "duration-normal",
        "duration-slow",
        "easing-standard",
        "easing-entrance",
        "easing-exit",
        "transition-fast",
        "transition-normal",
        "transition-slow"
    ],
    "breakpoints": ["sm", "md", "lg", "xl"]
};

const fontFamilyVariableNames = ["font-family-base", "font-family-heading", "font-family-sans", "font-family-mono"];

const fontSizeVariableNames = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];

const fontWeightVariableNames = ["regular", "medium", "semibold", "bold"];

const lineHeightVariableNames = ["body", "heading", "tight", "normal", "relaxed"];

function getCssVariable(variable: string): string {
    if (typeof document === "undefined") {
        return "";
    }

    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim();

    return value === "" ? `var(${variable})` : value;
}

export function FoundationsSection(params: { title: string; description?: ReactNode; children: ReactNode }) {
    const { title, description, children } = params;

    return (
        <section style={{ "marginBlock": "3rem" }}>
            <h2
                id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                style={{ "borderBottom": "1px solid var(--sds-color-border)", "paddingBottom": "0.5rem" }}
            >
                {title}
            </h2>
            {description !== undefined && <p style={{ "maxWidth": "52rem" }}>{description}</p>}
            {children}
        </section>
    );
}

export function FoundationsSwatchGrid(params: { children: ReactNode }) {
    return (
        <div
            style={{
                "display": "grid",
                "gridTemplateColumns": "repeat(auto-fill, minmax(10rem, 1fr))",
                "gap": "1rem"
            }}
        >
            {params.children}
        </div>
    );
}

export function FoundationsSwatch(params: { variable: string; style?: React.CSSProperties; children?: ReactNode }) {
    const { variable, style, children } = params;
    const value = getCssVariable(variable);

    return (
        <div
            style={{
                "border": "1px solid var(--sds-color-border)",
                "borderRadius": "var(--sds-radius-md)",
                "overflow": "hidden",
                ...style
            }}
        >
            <div
                style={{
                    "height": "4.5rem",
                    "background": `var(${variable})`
                }}
            />
            <div style={{ "padding": "0.75rem", "fontSize": "0.8rem" }}>
                <div style={{ "fontWeight": 600 }}>{variable}</div>
                <div style={{ "color": "var(--sds-color-text-muted)", "wordBreak": "break-all" }}>{value}</div>
                {children}
            </div>
        </div>
    );
}

export function ColorTokens() {
    return (
        <FoundationsSwatchGrid>
            {cssVariableNames.colors.map(variable => (
                <FoundationsSwatch key={variable} variable={`--sds-color-${variable}`} />
            ))}
        </FoundationsSwatchGrid>
    );
}

export function TypographyTokens() {
    return (
        <div>
            {fontFamilyVariableNames.map(variable => {
                const cssVariable = `--sds-${variable}`;

                return (
                    <div key={variable} style={{ "marginBlock": "1rem" }}>
                        <div style={{ "fontSize": "0.8rem", "color": "var(--sds-color-text-muted)" }}>
                            {cssVariable} — {getCssVariable(cssVariable)}
                        </div>
                        <div style={{ "fontFamily": `var(${cssVariable})`, "fontSize": "1.25rem" }}>
                            La République d'SGE — ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                        </div>
                    </div>
                );
            })}

            <table style={{ "borderCollapse": "collapse", "marginTop": "2rem" }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Variable</th>
                        <th style={thStyle}>Value</th>
                        <th style={thStyle}>Sample</th>
                    </tr>
                </thead>
                <tbody>
                    {fontSizeVariableNames.map(variable => {
                        const cssVariable = `--sds-font-size-${variable}`;

                        return (
                            <tr key={variable}>
                                <td style={tdStyle}>{cssVariable}</td>
                                <td style={tdStyle}>{getCssVariable(cssVariable)}</td>
                                <td style={{ ...tdStyle, "fontSize": `var(${cssVariable})` }}>Aa</td>
                            </tr>
                        );
                    })}
                    {fontWeightVariableNames.map(variable => {
                        const cssVariable = `--sds-font-weight-${variable}`;

                        return (
                            <tr key={variable}>
                                <td style={tdStyle}>{cssVariable}</td>
                                <td style={tdStyle}>{getCssVariable(cssVariable)}</td>
                                <td style={{ ...tdStyle, "fontWeight": `var(${cssVariable})` }}>Aa</td>
                            </tr>
                        );
                    })}
                    {lineHeightVariableNames.map(variable => {
                        const cssVariable = `--sds-line-height-${variable}`;

                        return (
                            <tr key={variable}>
                                <td style={tdStyle}>{cssVariable}</td>
                                <td style={tdStyle}>{getCssVariable(cssVariable)}</td>
                                <td style={{ ...tdStyle, "lineHeight": `var(${cssVariable})` }}>
                                    Le lorem ipsum est simplement du faux texte.
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    "textAlign": "left",
    "padding": "0.5rem 1rem 0.5rem 0",
    "borderBottom": "2px solid var(--sds-color-border)"
};

const tdStyle: React.CSSProperties = {
    "padding": "0.5rem 1rem 0.5rem 0",
    "borderBottom": "1px solid var(--sds-color-border)",
    "fontSize": "0.85rem"
};

export function SpacingTokens() {
    return (
        <div>
            {cssVariableNames.spacing.map(step => {
                const cssVariable = `--sds-space-${step}`;

                return (
                    <div key={step} style={{ "display": "flex", "alignItems": "center", "gap": "1rem", "marginBlock": "0.5rem" }}>
                        <div style={{ "width": "10rem", "fontSize": "0.8rem", "color": "var(--sds-color-text-muted)" }}>
                            {cssVariable}
                            <br />
                            {getCssVariable(cssVariable)}
                        </div>
                        <div style={{ "flex": 1, "display": "flex", "alignItems": "center", "gap": "0.5rem" }}>
                            <div style={{ "width": `var(${cssVariable})`, "maxWidth": "100%", "height": "1.5rem", "background": "var(--sds-color-primary)" }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function RadiusTokens() {
    return (
        <FoundationsSwatchGrid>
            {cssVariableNames.radius.map(variable => (
                <div key={variable} style={{ "textAlign": "center" }}>
                    <div
                        style={{
                            "width": "6rem",
                            "height": "6rem",
                            "margin": "0 auto 0.5rem",
                            "border": "1px solid var(--sds-color-border)",
                            "background": "var(--sds-color-surface-muted)",
                            "borderRadius": `var(--sds-radius-${variable})`
                        }}
                    />
                    <div style={{ "fontSize": "0.8rem", "fontWeight": 600 }}>--sds-radius-{variable}</div>
                    <div style={{ "fontSize": "0.8rem", "color": "var(--sds-color-text-muted)" }}>
                        {getCssVariable(`--sds-radius-${variable}`)}
                    </div>
                </div>
            ))}
        </FoundationsSwatchGrid>
    );
}

export function ElevationTokens() {
    return (
        <FoundationsSwatchGrid>
            {cssVariableNames.elevation.map(variable => (
                <div key={variable}>
                    <div
                        style={{
                            "height": "6rem",
                            "background": "var(--sds-color-background)",
                            "border": "1px solid var(--sds-color-border)",
                            "borderRadius": "var(--sds-radius-md)",
                            "boxShadow": `var(--sds-elevation-${variable})`
                        }}
                    />
                    <div style={{ "padding": "0.75rem 0", "fontSize": "0.8rem", "fontWeight": 600 }}>
                        --sds-elevation-{variable}
                    </div>
                </div>
            ))}
        </FoundationsSwatchGrid>
    );
}

function MotionSample(params: { cssVariable: string }) {
    const { cssVariable } = params;
    const [isMoved, setIsMoved] = React.useState(false);

    return (
        <div
            role="presentation"
            onMouseEnter={() => setIsMoved(true)}
            onMouseLeave={() => setIsMoved(false)}
            style={{ "cursor": "pointer" }}
            title="Hover to see the motion"
        >
            <div
                style={{
                    "width": "4rem",
                    "height": "0.5rem",
                    "background": "var(--sds-color-primary)",
                    "borderRadius": "var(--sds-radius-full)",
                    "transform": isMoved ? "translateX(2rem)" : undefined,
                    "transition": `transform var(${cssVariable})`
                }}
            />
        </div>
    );
}

export function MotionTokens() {
    return (
        <table style={{ "borderCollapse": "collapse" }}>
            <thead>
                <tr>
                    <th style={thStyle}>Variable</th>
                    <th style={thStyle}>Value</th>
                    <th style={thStyle}>Sample (hover)</th>
                </tr>
            </thead>
            <tbody>
                {cssVariableNames.motion.map(variable => {
                    const cssVariable = `--sds-${variable}`;

                    return (
                        <tr key={variable}>
                            <td style={tdStyle}>{cssVariable}</td>
                            <td style={tdStyle}>{getCssVariable(cssVariable)}</td>
                            <td style={tdStyle}>
                                <MotionSample cssVariable={cssVariable} />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

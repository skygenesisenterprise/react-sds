/**
 * SDS Native `Section` (page section with title and content).
 */

import * as React from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Heading } from "../primitives";

export type SectionProps = {
    children: React.ReactNode;
    title?: string;
    /** Heading level for `title`. Default 2. */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Default "md" — vertical spacing above the title. */
    spacing?: "none" | "sm" | "md" | "lg" | "xl";
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function Section(props: SectionProps) {
    const {
        children,
        title,
        headingLevel = 2,
        spacing = "md",
        style,
        testID
    } = props;

    const { tokens } = useSDSTheme();

    return (
        <View
            testID={testID}
            style={[
                { width: "100%", marginVertical: tokens.spacing[spacing] },
                style
            ]}
        >
            {title !== undefined && (
                <Heading level={headingLevel} style={{ marginBottom: tokens.spacing.sm }}>
                    {title}
                </Heading>
            )}
            {children}
        </View>
    );
}

Section.displayName = "Section";

export default Section;

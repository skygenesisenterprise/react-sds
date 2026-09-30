/**
 * SDS Native `ProcedureCard` — a generic government procedure entry.
 */

import * as React from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Text, Icon } from "../primitives";
import { Card } from "./Card";
import { StatusBadge, type StatusKey } from "./StatusBadge";

export type ProcedureCardProps = {
    title: string;
    description?: string;
    /** Status key (default "available"). */
    status?: StatusKey;
    /** Category/label chip (optional). */
    category?: string;
    /** Leading icon name (default "document"). */
    icon?: string;
    onPress?: () => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function ProcedureCard(props: ProcedureCardProps) {
    const {
        title,
        description,
        status = "available",
        category,
        icon = "document",
        onPress,
        accessibilityLabel,
        accessibilityHint,
        style,
        testID
    } = props;

    const { colors, tokens } = useSDSTheme();

    return (
        <Card
            testID={testID}
            onPress={onPress}
            bordered
            accessibilityLabel={accessibilityLabel ?? title}
            accessibilityHint={accessibilityHint}
            style={style}
        >
            <View style={{ gap: tokens.spacing.sm }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View
                        style={{
                            width: tokens.dimensions.controlMd,
                            height: tokens.dimensions.controlMd,
                            borderRadius: tokens.radius.md,
                            backgroundColor: colors.surfaceMuted,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Icon name={icon} size={tokens.dimensions.iconMd} color={colors.primary} />
                    </View>
                    <StatusBadge status={status}>{statusLabel(status)}</StatusBadge>
                </View>
                <View style={{ gap: tokens.spacing.xs }}>
                    {category !== undefined && (
                        <Text variant="caption" muted>
                            {category}
                        </Text>
                    )}
                    <Text
                        style={{ fontWeight: tokens.typography["fontWeight-semibold"], color: colors.text }}
                    >
                        {title}
                    </Text>
                    {description !== undefined && (
                        <Text variant="bodySmall">{description}</Text>
                    )}
                </View>
            </View>
        </Card>
    );
}

function statusLabel(status: StatusKey): string {
    switch (status) {
        case "available":
            return "Disponible";
        case "unavailable":
            return "Indisponible";
        case "pending":
            return "En attente";
        case "inProgress":
            return "En cours";
        case "done":
            return "Terminé";
        case "draft":
            return "Brouillon";
        case "error":
            return "Erreur";
    }
}

ProcedureCard.displayName = "ProcedureCard";

export default ProcedureCard;

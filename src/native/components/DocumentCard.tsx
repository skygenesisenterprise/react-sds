/**
 * SDS Native `DocumentCard` — a generic document/file entry.
 */

import * as React from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSDSTheme } from "../theme";
import { Text, Icon } from "../primitives";
import { Card } from "./Card";
import { StatusBadge, type StatusKey } from "./StatusBadge";

export type DocumentCardProps = {
    title: string;
    /** File metadata, e.g. "PDF · 1,2 Mo". */
    meta?: string;
    /** Status key (default "available"). */
    status?: StatusKey;
    /** Document type icon (default "document"). */
    icon?: string;
    onPress?: () => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export function DocumentCard(props: DocumentCardProps) {
    const {
        title,
        meta,
        status = "available",
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: tokens.spacing.md }}>
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
                <View style={{ flex: 1, gap: tokens.spacing.xs }}>
                    <Text
                        numberOfLines={2}
                        style={{ fontWeight: tokens.typography["fontWeight-medium"], color: colors.text }}
                    >
                        {title}
                    </Text>
                    {meta !== undefined && <Text variant="caption">{meta}</Text>}
                </View>
                <StatusBadge status={status}>{statusLabel(status)}</StatusBadge>
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

DocumentCard.displayName = "DocumentCard";

export default DocumentCard;
/**
 * SDS Native `StatusBadge` — a badge conveying a procedural/service status.
 *
 * Generic across government apps: the tone maps a status key to a color.
 */

import * as React from "react";
import { Badge, type BadgeTone } from "./Badge";

export type StatusKey = "available" | "unavailable" | "pending" | "inProgress" | "done" | "draft" | "error";

export type StatusBadgeProps = {
    children: React.ReactNode;
    /** Status key, mapped to a badge tone. Default "available". */
    status?: StatusKey;
    /** Optional explicit tone (overrides the status mapping). */
    tone?: BadgeTone;
    accessibilityLabel?: string;
    style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
    testID?: string;
};

const STATUS_TONE: Record<StatusKey, BadgeTone> = {
    available: "success",
    unavailable: "neutral",
    pending: "warning",
    inProgress: "info",
    done: "success",
    draft: "neutral",
    error: "error"
};

export function StatusBadge(props: StatusBadgeProps) {
    const { children, status = "available", tone, ...rest } = props;

    return (
        <Badge {...rest} tone={tone ?? STATUS_TONE[status]}>
            {children}
        </Badge>
    );
}

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;

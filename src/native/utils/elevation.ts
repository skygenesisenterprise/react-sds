/**
 * Utility to translate an SDS elevation token into React Native shadow props.
 */

import { Platform } from "react-native";
import type { ViewStyle } from "react-native";
import type { SDSElevation } from "../tokens";

export function elevationToStyle(elevation: SDSElevation): ViewStyle {
    if (Platform.OS === "android") {
        return { elevation: elevation.android };
    }

    return {
        shadowColor: "#000000",
        shadowOffset: elevation.offset,
        shadowOpacity: elevation.opacity,
        shadowRadius: elevation.radius
    };
}

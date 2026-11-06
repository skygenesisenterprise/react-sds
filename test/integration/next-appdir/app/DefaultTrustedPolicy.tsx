"use client";

import { useEffect } from "react";

export function DefaultTrustedPolicy() {
    useEffect(() => {
        // You need to add a default trusted type to enable legacy-chart to inject charts
        // Or you can disable require-trusted-types-for CSP
        if (
            window.trustedTypes &&
            window.trustedTypes.createPolicy &&
            !window.trustedTypes.defaultPolicy
        ) {
            window.trustedTypes.createPolicy("default", {
                createHTML: string => string
            });
        }
    });

    return null;
}

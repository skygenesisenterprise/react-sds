"use client";

import * as React from "react";

export type SDSPortalContextValue = {
    organization: string;
    organizationShort?: string;
    homeHref?: string;
};

const SDSPortalContext = React.createContext<SDSPortalContextValue | null>(null);

export const SDSPortalProvider = SDSPortalContext.Provider;

export function useSDSPortal(): SDSPortalContextValue {
    const value = React.useContext(SDSPortalContext);

    if (value === null) {
        throw new Error(
            "[react-sds] useSDSPortal must be used inside an <SDSPortal>. Wrap your page with <SDSPortal>."
        );
    }

    return value;
}

export function useOptionalSDSPortal(): SDSPortalContextValue | null {
    return React.useContext(SDSPortalContext);
}
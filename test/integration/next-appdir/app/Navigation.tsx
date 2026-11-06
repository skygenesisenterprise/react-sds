"use client";

import { MainNavigation } from "@skygenesisenterprise/react-sds/MainNavigation";
import { useSelectedLayoutSegment } from "next/navigation";

export function Navigation() {
    const segment = useSelectedLayoutSegment();

    return (
        <MainNavigation
            items={[
                {
                    "text": "Home",
                    "linkProps": {
                        "href": "/"
                    },
                    "isActive": segment === null
                },
                {
                    "text": "Mui playground",
                    "linkProps": {
                        "href": "/mui"
                    },
                    "isActive": segment === "mui"
                },
                {
                    "text": "Charts",
                    "linkProps": {
                        "href": "/legacy-chart"
                    },
                    "isActive": segment === "legacy-chart"
                },
                {
                    "text": "External link",
                    "linkProps": {
                        "href": "https://example.com"
                    }
                }
            ]}
        />
    );
}

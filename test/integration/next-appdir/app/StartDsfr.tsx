"use client";

import { startReactDsfr } from "@skygenesisenterprise/react-sds/next-appdir";
import { defaultColorScheme } from "./defaultColorScheme";
import { addAlertTranslations } from "@skygenesisenterprise/react-sds/Alert";
import Link from "next/link";

declare module "@skygenesisenterprise/react-sds/next-appdir" {
    interface RegisterLink { 
        Link: typeof Link;
    }
}

startReactDsfr({ 
	defaultColorScheme, 
	Link,
    "doCheckNonce": true
});

export function StartDsfr(){
	return null;
}

addAlertTranslations({
    "lang": "fr",
    "messages": {
        "hide message": "Masquer le message (modifié)",
    }
});

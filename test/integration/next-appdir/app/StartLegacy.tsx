"use client";

import { startReactSds } from "@skygenesisenterprise/react-sds/next-appdir";
import { defaultColorScheme } from "./defaultColorScheme";
import { addAlertTranslations } from "@skygenesisenterprise/react-sds/Alert";
import Link from "next/link";

declare module "@skygenesisenterprise/react-sds/next-appdir" {
    interface RegisterLink { 
        Link: typeof Link;
    }
}

startReactSds({ 
	defaultColorScheme, 
	Link,
    "doCheckNonce": true
});

export function StartLegacy(){
	return null;
}

addAlertTranslations({
    "lang": "fr",
    "messages": {
        "hide message": "Masquer le message (modifié)",
    }
});

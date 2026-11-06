/**
 * Chargement paresseux de `discord.js`, réservé au serveur (Node.js).
 *
 * `createRequire` charge `discord.js` au moment où une opération Discord est
 * réellement déclenchée — jamais statiquement — ce qui :
 *  - garantit que `discord.js` n'est jamais embarqué dans un bundle navigateur ;
 *  - permet au module `@skygenesisenterprise/react-sds/discord` de compiler sans que
 *    `discord.js` soit installé (résolution typée en `any`).
 *
 * Le module `@skygenesisenterprise/react-sds/discord` n'est pas exporté depuis l'entrée
 * racine de la librairie : un consommateur web ne le charge jamais.
 */

import { createRequire } from "module";

let cached: any = null;

export async function loadDiscordJS(): Promise<any> {
    if (cached !== null) {
        return cached;
    }

    // Vérifie que l'on est bien côté serveur.
    if (
        typeof window !== "undefined" ||
        typeof process === "undefined" ||
        process.versions?.node === undefined
    ) {
        throw new Error(
            "[react-sds/discord] L'intégration Discord est réservée au serveur (Node.js). " +
                "Ne l'importez jamais depuis un bundle navigateur."
        );
    }

    try {
        const require = createRequire(import.meta.url);
        cached = require("discord.js");
        return cached;
    } catch {
        throw new Error(
            "[react-sds/discord] La dépendance optionnelle `discord.js` est requise. " +
                "Installez-la : `pnpm add discord.js`."
        );
    }
}
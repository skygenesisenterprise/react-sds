/**
 * Intégration Discord officielle de @skygenesisenterprise/react-sds.
 *
 * Cette intégration est **server-only** : elle charge `discord.js` dynamiquement et
 * n'est jamais exportée depuis l'entrée racine de la librairie. Importez-la depuis le
 * sous-chemin dédié, uniquement dans du code Node.js / serveur :
 *
 * ```ts
 * import { SDSDiscordClient } from "@skygenesisenterprise/react-sds/discord";
 * ```
 *
 * Elle encapsule `discord.js` mais ne le cache pas : `client.raw` / `getRawClient()`
 * exposent le client brut pour les usages avancés.
 */
export { SDSDiscordClient } from "./client";
export { buildNotificationEmbed, sdsDiscordTypeLabel, TYPE_EMOJI } from "./embeds";
export type { SDSDiscordEmbed } from "./embeds";
export { sendNotificationToChannel } from "./notifications";
export { createWebhook } from "./webhooks";
export type { SDSWebhookHandle } from "./webhooks";
export { registerSlashCommands } from "./commands";
export type { SDSSlashCommandDefinition } from "./commands";
export type {
    SDSDiscordClientOptions,
    SDSDiscordNotifyParams,
    SDSDiscordNotificationType,
    SDSDiscordField
} from "./types";
export { SDSDiscordEmbedColor } from "./types";
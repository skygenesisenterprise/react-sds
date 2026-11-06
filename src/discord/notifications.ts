/**
 * Notifications — envoi d'embeds dans un canal d'un bot gateway.
 */
import { buildNotificationEmbed } from "./embeds";
import type { SDSDiscordNotifyParams } from "./types";

/**
 * Envoie une notification dans le canal donné via le client gateway fourni.
 * `client` est l'instance discord.js brute (accessible via `SDSDiscordClient.raw`).
 */
export async function sendNotificationToChannel(
    client: any,
    channelId: string,
    params: SDSDiscordNotifyParams
): Promise<unknown> {
    const channel = await client.channels.fetch(channelId);

    if (channel == null) {
        throw new Error(`[react-sds/discord] Canal introuvable : ${channelId}`);
    }

    const embed = buildNotificationEmbed(params);

    return channel.send({ embeds: [embed] });
}
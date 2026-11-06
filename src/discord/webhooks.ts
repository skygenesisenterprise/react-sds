/**
 * Webhooks — envoi de notifications via une URL de webhook Discord (mode léger,
 * sans connexion gateway persistante).
 */
import { loadDiscordJS } from "./loader";
import { buildNotificationEmbed } from "./embeds";
import type { SDSDiscordNotifyParams } from "./types";

export type SDSWebhookHandle = {
    sendNotification(params: SDSDiscordNotifyParams): Promise<unknown>;
    sendMessage(content: string): Promise<unknown>;
};

/**
 * Crée un gestionnaire de webhook à partir d'une URL.
 */
export async function createWebhook(webhookUrl: string): Promise<SDSWebhookHandle> {
    const { WebhookClient } = await loadDiscordJS();
    const webhook = new WebhookClient({ url: webhookUrl });

    return {
        async sendNotification(params) {
            const embed = buildNotificationEmbed(params);
            return webhook.send({ embeds: [embed] });
        },
        async sendMessage(content) {
            return webhook.send(content);
        }
    };
}
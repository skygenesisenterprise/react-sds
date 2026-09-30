/**
 * Embeds SDS — mise en forme des notifications Discord selon l'identité numérique
 * de la République d'SGE. Les embeds sont construits comme des objets simples,
 * sérialisables, transmis à discord.js par le client.
 */
import { SDSDiscordEmbedColor } from "./types";
import type {
    SDSDiscordNotifyParams,
    SDSDiscordNotificationType,
    SDSDiscordField
} from "./types";

export type SDSDiscordEmbed = {
    title: string;
    description?: string;
    url?: string;
    color: number;
    author?: { name: string; icon_url?: string };
    fields?: SDSDiscordField[];
    timestamp: string;
};

const TYPE_EMOJI: Record<SDSDiscordNotificationType, string> = {
    publication: "📄",
    incident: "🚨",
    maintenance: "🛠️",
    event: "📅",
    announcement: "📣",
    status: "ℹ️"
};

/** Libellé lisible du type de notification. */
export function sdsDiscordTypeLabel(type: SDSDiscordNotificationType): string {
    switch (type) {
        case "publication":
            return "Nouvelle publication";
        case "incident":
            return "Incident";
        case "maintenance":
            return "Maintenance";
        case "event":
            return "Événement";
        case "announcement":
            return "Annonce";
        case "status":
            return "État du service";
    }
}

/**
 * Construit l'embed d'une notification conforme à l'identité SGE.
 */
export function buildNotificationEmbed(
    params: SDSDiscordNotifyParams,
    defaultAuthor = "République d'SGE",
    avatarUrl?: string
): SDSDiscordEmbed {
    const { type, organization, title, description, url, fields, timestamp } = params;

    return {
        title: `${TYPE_EMOJI[type]} ${title}`,
        description,
        url,
        color: SDSDiscordEmbedColor[type],
        author: {
            name: organization ?? defaultAuthor,
            ...(avatarUrl ? { icon_url: avatarUrl } : {})
        },
        fields,
        timestamp: timestamp instanceof Date ? timestamp.toISOString() : new Date(timestamp ?? Date.now()).toISOString()
    };
}

/** Émoji associé à un type (utile pour un message texte simple). */
export { TYPE_EMOJI };
/**
 * Types partagés de l'intégration Discord SDS.
 */

/** Types de notifications institutionnelles supportés par `notify()`. */
export type SDSDiscordNotificationType =
    | "publication"
    | "incident"
    | "maintenance"
    | "event"
    | "announcement"
    | "status";

export type SDSDiscordField = {
    name: string;
    value: string;
    inline?: boolean;
};

export type SDSDiscordNotifyParams = {
    type: SDSDiscordNotificationType;
    /** Institution émettrice (ex. "Ministère de la Défense"). */
    organization?: string;
    title: string;
    description?: string;
    url?: string;
    fields?: SDSDiscordField[];
    /** Horodatage de l'événement (défaut: maintenant). */
    timestamp?: Date | string;
    /** Canal cible (webhook : surcharge le canal par défaut si fourni). */
    channelId?: string;
};

export type SDSDiscordClientOptions = {
    /** Token du bot gateway. Requis si `webhookUrl` est absent. */
    token?: string;
    /** URL de webhook — mode léger sans connexion gateway. */
    webhookUrl?: string;
    /** Canal par défaut utilisé en mode gateway. */
    defaultChannelId?: string;
    /** Nom d'auteur par défaut des embeds (défaut: "République d'SGE"). */
    defaultAuthor?: string;
    /** URL du logo/icône affichée sur les embeds. */
    avatarUrl?: string;
};

/** Couleurs des embeds par type (identité SGE, en décimal pour discord.js). */
export const SDSDiscordEmbedColor: Record<SDSDiscordNotificationType, number> = {
    publication: 0x1e3a8a, // --sds-color-primary
    incident: 0xb34000, // warning
    maintenance: 0x0063cb, // info
    event: 0x18753c, // success
    announcement: 0x4f46e5,
    status: 0x6b7280
};
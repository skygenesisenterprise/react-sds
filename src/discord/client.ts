/**
 * SDSDiscordClient — le client haut niveau de l'intégration Discord SDS.
 *
 * Il encapsule `discord.js` (gateway ou webhook) derrière une API simple :
 *
 * ```ts
 * const discord = new SDSDiscordClient({ webhookUrl: process.env.DISCORD_WEBHOOK });
 * await discord.notify({
 *     type: "publication",
 *     organization: "Ministère de la Défense",
 *     title: "Rapport annuel 2026",
 *     url: "https://…"
 * });
 * ```
 *
 * Il reste ouvert : `discord.raw` expose le client discord.js brut (ou le webhook)
 * pour les usages avancés, et `discord.getRawClient()` force la connexion gateway.
 */
import { loadDiscordJS } from "./loader";
import { buildNotificationEmbed } from "./embeds";
import { sendNotificationToChannel } from "./notifications";
import type { SDSDiscordClientOptions, SDSDiscordNotifyParams } from "./types";

export class SDSDiscordClient {
    readonly options: SDSDiscordClientOptions;

    private _client: any = null;
    private _webhook: any = null;
    private _loginPromise: Promise<any> | null = null;

    constructor(options: SDSDiscordClientOptions) {
        if (options.webhookUrl === undefined && options.token === undefined) {
            throw new Error(
                "[react-sds/discord] SDSDiscordClient nécessite `webhookUrl` ou `token`."
            );
        }

        this.options = options;
    }

    /**
     * Le client discord.js brut (gateway) — `null` tant que la connexion n'a pas
     * été établie. Pour forcer la connexion, voir `getRawClient()`.
     */
    get raw(): any {
        return this._client ?? this._webhook;
    }

    /**
     * Établit (et met en cache) la connexion gateway et renvoie le client discord.js.
     */
    async getRawClient(): Promise<any> {
        if (this.options.token === undefined) {
            throw new Error(
                "[react-sds/discord] getRawClient() requiert un `token` (mode gateway)."
            );
        }

        if (this._client !== null) {
            return this._client;
        }

        if (this._loginPromise === null) {
            this._loginPromise = (async () => {
                const { Client, GatewayIntentBits } = await loadDiscordJS();
                const client = new Client({
                    intents: [GatewayIntentBits.Guilds]
                });
                await client.login(this.options.token);
                this._client = client;
                return client;
            })();
        }

        return this._loginPromise;
    }

    /**
     * Envoie une notification institutionnelle (embed conforme à l'identité SGE).
     * Utilise le webhook s'il est configuré, sinon le canal par défaut (gateway).
     */
    async notify(params: SDSDiscordNotifyParams): Promise<unknown> {
        const { webhookUrl, token, defaultChannelId } = this.options;

        if (webhookUrl !== undefined) {
            return this.sendViaWebhook(params);
        }

        if (token !== undefined) {
            const channelId = params.channelId ?? defaultChannelId;

            if (channelId === undefined) {
                throw new Error(
                    "[react-sds/discord] notify() en mode gateway requiert `channelId` (ou `defaultChannelId`)."
                );
            }

            const client = await this.getRawClient();
            return sendNotificationToChannel(client, channelId, params);
        }

        throw new Error("[react-sds/discord] SDSDiscordClient non configuré.");
    }

    private async sendViaWebhook(params: SDSDiscordNotifyParams): Promise<unknown> {
        const { webhookUrl, defaultAuthor, avatarUrl } = this.options;

        if (this._webhook === null) {
            const { WebhookClient } = await loadDiscordJS();
            this._webhook = new WebhookClient({ url: webhookUrl });
        }

        const embed = buildNotificationEmbed(params, defaultAuthor, avatarUrl);
        return this._webhook.send({ embeds: [embed] });
    }

    /**
     * Envoie un simple message texte (via webhook ou canal par défaut).
     */
    async sendMessage(content: string, channelId?: string): Promise<unknown> {
        const { webhookUrl, token, defaultChannelId } = this.options;

        if (webhookUrl !== undefined) {
            if (this._webhook === null) {
                const { WebhookClient } = await loadDiscordJS();
                this._webhook = new WebhookClient({ url: webhookUrl });
            }
            return this._webhook.send(content);
        }

        if (token !== undefined) {
            const targetChannelId = channelId ?? defaultChannelId;

            if (targetChannelId === undefined) {
                throw new Error("[react-sds/discord] sendMessage() requiert un canal.");
            }

            const client = await this.getRawClient();
            const channel = await client.channels.fetch(targetChannelId);
            return channel.send(content);
        }

        throw new Error("[react-sds/discord] SDSDiscordClient non configuré.");
    }

    /**
     * Ferme proprement la connexion gateway (à appeler à l'arrêt du serveur).
     */
    async destroy(): Promise<void> {
        if (this._client !== null && typeof this._client.destroy === "function") {
            await this._client.destroy();
        }
        this._client = null;
        this._loginPromise = null;
    }
}
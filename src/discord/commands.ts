/**
 * Commandes — petite aide pour enregistrer des commandes slash cohérentes avec
 * l'identité SGE. Reste un surcouche fine : le consommateur garde l'accès aux
 * objets discord.js bruts.
 */
import { loadDiscordJS } from "./loader";

export type SDSSlashCommandDefinition = {
    name: string;
    description: string;
    options?: {
        name: string;
        description: string;
        required?: boolean;
        type?: number;
    }[];
};

/**
 * Enregistre une liste de commandes slash pour une application Discord.
 * `applicationId` est l'identifiant de l'application ; `token` un token de bot.
 */
export async function registerSlashCommands(
    applicationId: string,
    token: string,
    commands: SDSSlashCommandDefinition[]
): Promise<void> {
    const { REST, Routes } = await loadDiscordJS();

    const rest = new REST({ version: "10" }).setToken(token);

    await rest.put(Routes.applicationCommands(applicationId), {
        body: commands
    });
}
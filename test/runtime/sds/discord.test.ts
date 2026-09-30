import { describe, it, expect } from "vitest";
import * as fs from "fs";
import { join as pathJoin } from "path";
import { buildNotificationEmbed, sdsDiscordTypeLabel } from "../../../src/discord/embeds";
import { SDSDiscordEmbedColor } from "../../../src/discord/types";

const projectRootDirPath = process.cwd();

const readSrcFile = (relativeFilePath: string): string =>
    fs.readFileSync(pathJoin(projectRootDirPath, "src", relativeFilePath)).toString("utf8");

describe("SDS Discord — embeds", () => {
    it("builds an embed with a title, author, color and timestamp", () => {
        const embed = buildNotificationEmbed(
            {
                "type": "publication",
                "organization": "Ministère de la Défense",
                "title": "Rapport annuel 2026",
                "url": "https://exemple.sge/r",
                "description": "Le rapport annuel est en ligne."
            },
            "République d'SGE"
        );

        expect(embed.title).toContain("Rapport annuel 2026");
        expect(embed.url).toBe("https://exemple.sge/r");
        expect(embed.author?.name).toBe("Ministère de la Défense");
        expect(embed.color).toBe(SDSDiscordEmbedColor.publication);
        expect(new Date(embed.timestamp).toString()).not.toBe("Invalid Date");
    });

    it("defaults the author to the provided default", () => {
        const embed = buildNotificationEmbed({ "type": "status", "title": "Tout est opérationnel" });
        expect(embed.author?.name).toBe("République d'SGE");
    });

    it("has one distinct color per notification type", () => {
        const types = ["publication", "incident", "maintenance", "event", "announcement", "status"] as const;
        const colors = new Set(types.map(t => SDSDiscordEmbedColor[t]));
        expect(colors.size).toBe(types.length);
    });

    it("provides a human label for every type", () => {
        for (const type of ["publication", "incident", "maintenance", "event", "announcement", "status"] as const) {
            expect(sdsDiscordTypeLabel(type).length).toBeGreaterThan(0);
        }
    });
});

describe("SDS Discord — server-only isolation", () => {
    it("never imports discord.js statically (lazy, server-only)", () => {
        const loader = readSrcFile("discord/loader.ts");
        expect(loader).toContain("createRequire");
        expect(loader).toContain('require("discord.js")');

        // The whole discord folder must not statically import discord.js.
        const discordFiles = ["loader.ts", "client.ts", "embeds.ts", "notifications.ts", "webhooks.ts", "commands.ts"];
        for (const file of discordFiles) {
            const content = readSrcFile(`discord/${file}`);
            expect(
                content.match(/^import .* from "discord\.js"/m),
                `${file} must not statically import discord.js`
            ).toBeNull();
        }
    });

    it("guards against browser usage at runtime", () => {
        const loader = readSrcFile("discord/loader.ts");
        expect(loader).toContain("typeof window");
        expect(loader).toContain("Node.js");
    });

    it("is not exported from the library root (no client bundle leak)", () => {
        const rootIndex = readSrcFile("index.ts");
        expect(rootIndex).not.toContain("discord");
    });

    it("is reachable only via the dedicated subpath", () => {
        const pkg = JSON.parse(
            fs.readFileSync(pathJoin(projectRootDirPath, "package.json")).toString("utf8")
        );

        expect(pkg.exports["./discord"]).toBeDefined();
        expect(pkg.exports["./discord/server"]).toBeDefined();
        // discord.js is an optional peer dependency, never a hard dependency.
        expect(pkg.peerDependenciesMeta["discord.js"].optional).toBe(true);
        expect(pkg.dependencies["discord.js"]).toBeUndefined();
    });
});

describe("SDS Discord — public module", () => {
    it("exports the client and helpers", async () => {
        const discord = await import("../../../src/discord");
        expect(typeof discord.SDSDiscordClient).toBe("function");
        expect(typeof discord.buildNotificationEmbed).toBe("function");
        expect(typeof discord.createWebhook).toBe("function");
        expect(typeof discord.sendNotificationToChannel).toBe("function");
        expect(typeof discord.registerSlashCommands).toBe("function");
        expect(discord.SDSDiscordEmbedColor).toBeDefined();
    });
});
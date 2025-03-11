import type {APIEmbed, Client, EmbedBuilder, Interaction, MessageFlags} from "discord.js";
//  Represents a discord command


interface CommandConfiguration {
    name: string;  // Name of the command, "hello" for "/hello"
    description: string;

    responseFlag: MessageFlags;

}

interface BotCommand {
    execute: (client: Client, interaction: Interaction, ...args: any[]) => Promise<APIEmbed | EmbedBuilder>;
}

interface ICommand extends CommandConfiguration, BotCommand {}

export { CommandConfiguration, BotCommand, ICommand};

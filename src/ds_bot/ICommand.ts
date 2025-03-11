import {
    APIEmbed,
    ChatInputApplicationCommandData, ChatInputCommandInteraction,
    Client, CommandInteraction,
    EmbedBuilder,
    Interaction,
    MessageFlags, SlashCommandBuilder
} from "discord.js";
//  Represents a discord command


interface CommandConfiguration {
    name: string;  // Name of the command, "hello" for "/hello"
    description: string;
    responseFlag: MessageFlags.Ephemeral | MessageFlags.SuppressNotifications | undefined;
}

interface BotCommandExecutor {
    execute: (client: Client, interaction: ChatInputCommandInteraction, ...args: any[]) => Promise<APIEmbed | EmbedBuilder>;
}

interface CommandParameter {
    name: string;
    description?: string;
    type: string;
}

interface ICommand extends CommandConfiguration, BotCommandExecutor {
    parameters: CommandParameter[];
}

interface DSBotCommand extends ChatInputApplicationCommandData, ICommand {
    builder: SlashCommandBuilder
}

export { CommandConfiguration, BotCommandExecutor, ICommand, DSBotCommand, CommandParameter };

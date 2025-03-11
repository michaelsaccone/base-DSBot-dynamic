import loadCommands from "./commandsLoader.ts";

import {
    ApplicationCommandOptionData,
    ChatInputApplicationCommandData,
    ApplicationCommandOptionType,
    SlashCommandBuilder
} from "discord.js";
import {DSBotCommand, ICommand} from "./ICommand.ts";


async function registerCommands(commands: ICommand[]): Promise<{
    register: Map<string, DSBotCommand>,
    builder: SlashCommandBuilder[]
}> {

    const commandRegister: Map<string, DSBotCommand> = new Map();
    const commandBuilders: SlashCommandBuilder[] = [];

    for (const command of commands) {

        const commandParameters: ApplicationCommandOptionData[] = []

        const commandBuilder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)

        //  Registering parameters
        command.parameters.forEach((parameter, i) => {

            console.log("Adding validator for ", parameter)

            let parameterType: ApplicationCommandOptionType;

            switch (parameter.type) {
                case "string":
                    commandBuilder
                        .addStringOption(o =>
                            o.setName(parameter.name).setDescription(parameter.description ?? parameter.name)
                        )
                    parameterType = ApplicationCommandOptionType.String;
                    break;
                case "number":
                    commandBuilder
                        .addNumberOption(o =>
                            o.setName(parameter.name).setDescription(parameter.description ?? parameter.name)
                        )
                    parameterType = ApplicationCommandOptionType.Number;
                    break;
                case "boolean":
                    commandBuilder
                        .addBooleanOption(o =>
                            o.setName(parameter.name).setDescription(parameter.description ?? parameter.name)
                        )
                    break;
                default:
                    commandBuilder
                        .addStringOption(o =>
                            o.setName(parameter.name).setDescription(parameter.description ?? parameter.name)
                        )
                    parameterType = ApplicationCommandOptionType.String;
                    break;
            }

            commandBuilders.push(commandBuilder);

            // commandParameters.push({
            //     name: parameter.name,
            //     description: parameter.name,
            //     autocomplete: true,
            //     required: true,
            //     type: parameterType
            // });
        })


        commandRegister.set(command.name, {
            ...command,
            options: commandParameters,
            builder: commandBuilder
        });

    }
    return {
        register: commandRegister,
        builder: commandBuilders
    }
}

export default registerCommands;

import {BotCommandExecutor} from "../../ICommand.ts";
import DSCommand, {BotExecutor, DSParam} from "../../inputCommand.decorator.ts";
import {ChatInputCommandInteraction, Client, type CommandInteraction, ComponentBuilder, EmbedBuilder} from "discord.js";

@DSCommand({
    name: "apeyron-ai",
    description: "Richiama l'AI di Apeyron",
    responseFlag: undefined
})
class EchoCommand implements BotCommandExecutor {

    async execute(
        client: Client,
        interaction: ChatInputCommandInteraction,
        @DSParam("Il messaggio per l'AI")
        messaggio: string) {

        let response = new EmbedBuilder()

        response
            .setTitle("APEYRON AI")
            .setDescription(messaggio)

        return response
    }

}

export default new EchoCommand();

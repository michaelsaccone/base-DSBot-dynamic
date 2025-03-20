import {ChatInputCommandInteraction, Client, type CommandInteraction, ComponentBuilder, EmbedBuilder} from "discord.js";
import DSCommand, {DSParam} from "../../ds_bot/inputCommand.decorator.ts";
import {BotCommandExecutor} from "../../ds_bot/ICommand.ts";

@DSCommand({
    name: "apeyron-ai",
    description: "Richiama l'AI di Apeyron",
    responseFlag: undefined
})
class EchoCommand implements BotCommandExecutor {

    public readonly test: string;

    constructor() {
        this.test = "CIAOOONE, il test dev'essere letto da comando"
    }

    async execute(
        client: Client,
        interaction: ChatInputCommandInteraction,
        @DSParam("Il messaggio per l'AI")
        messaggio: string) {

        console.log("Test is ", this.test);

        return messaggio
    }

}

export default new EchoCommand();

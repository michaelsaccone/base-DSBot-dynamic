import {BotCommand} from "../../ICommand.ts";
import {Client, EmbedBuilder, Interaction, MessageFlags} from "discord.js";
import User from "../../../models/user.ts";
import DSCommand from "../../inputCommand.decorator.ts";


@DSCommand({
    name: "apeyron-check",
    description: "Controlla lo status di connessione del tuo account",
    responseFlag: MessageFlags.Ephemeral
})
class ConnectionCheckCommand implements BotCommand {

    async execute(client: Client, interaction: Interaction, message: string, badacomelafuma: number) {

        const user = await User.findOne({'discordInfos.id': interaction.user.id});

        let response = new EmbedBuilder()

        if (user) {
            response
                .setTitle("✅ Account Trovato")
                .setDescription("Il tuo account Minecraft associato è: **${user.nickname}**")
                .setURL("https://mc-heads.net/avatar/${user.nickname}")
        } else {
            response
                .setTitle("❌ Account non collegato!")
                .setDescription("Per usare il Bot, collega prima il tuo account!")
                .setFields([
                    {
                        name: 'Come collegare l\'account',
                        value: '[Clicca qui per collegare il tuo account Minecraft](https://mc.apeyron.it/dashboard)'
                    }
                ])
        }

        return response;
    }

}

//  TODO Make Orchestator that instances all classes as singleton and reads their value
export default new ConnectionCheckCommand();

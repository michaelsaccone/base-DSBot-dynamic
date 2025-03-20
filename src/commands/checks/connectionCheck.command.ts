import {
    ChatInputCommandInteraction,
    Client,
    CommandInteraction,
    EmbedBuilder,
    Interaction,
    MessageFlags
} from "discord.js";
import DSCommand from "../../ds_bot/inputCommand.decorator.ts";
import {BotCommandExecutor} from "../../ds_bot/ICommand.ts";
import User from "../../models/user.ts";

@DSCommand({
    name: "apeyron-check",
    description: "Controlla lo status di connessione del tuo account",
    responseFlag: undefined
})
class ConnectionCheckCommand implements BotCommandExecutor {

    async execute(client: Client, interaction: ChatInputCommandInteraction) {

        const user = await
            User.findOne({'discordInfos.id': interaction.user.id});

        let response = new EmbedBuilder()

        if (user) {
            response
                .setTitle("✅ Account Trovato")
                .setDescription(`Il tuo account Minecraft associato è: **${user.nickname}**`)
                // .setImage(`https://mc-heads.net/avatar/${user.nickname}`)
                .setColor("#e4e895")
                .setThumbnail(`https://mc-heads.net/avatar/${user.nickname}`)
                .setFooter({
                    text: "Apeyron AI • Made with ❤️"
                })
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

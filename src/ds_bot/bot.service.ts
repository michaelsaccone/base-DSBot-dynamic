import {
    ChatInputCommandInteraction,
    Client,
    CommandInteraction,
    Events,
    GatewayIntentBits,
    Interaction, InteractionReplyOptions,
    MessageFlags, MessagePayload,
    Partials,
    REST
} from "discord.js";
import {ICommand} from "./ICommand.ts";
import loadCommands from "./commandsLoader.ts";
import registerCommands from "./commandsRegister.ts";

const bot_token = process.env.DISCORD_BOT_TOKEN!;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

const rawCommands = await loadCommands();
const {register: commands, builder: commandBuilders } = await registerCommands(rawCommands);

export async function handleSlashCommand(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {

    if (interaction.channelId !== process.env.DISCORD_CHANNEL_ID) {
        await interaction.reply({
            embeds: [{
                color: 0xff0000,
                title: '⚠️ Canale Errato',
                description: 'Questo comando può essere usato solo nel canale appropriato!'
            }],
            flags: MessageFlags.Ephemeral // Se vuoi che la risposta sia visibile solo all'utente che ha usato il comando tieni questo, senno commentalo
        });
        return;
    }


    const slashCommand = commands.get(interaction.commandName)!;
    if (!slashCommand) {
        await interaction.followUp({ content: "Comando errato!" });
        return;
    }

    const args: any[] = [];

    slashCommand.parameters?.forEach(param => {
        args.push(
            interaction.options.getString(param.name)
        )
    })

    console.log("Passing arguments to slashCommand", args)

    const result = await slashCommand.execute(client, interaction, ...args);

    const response: InteractionReplyOptions = {
        flags: slashCommand.responseFlag
    }
    if (typeof result === "string") response.content = result;
    else response.embeds = [result]

    await interaction.reply(response);
};

export function startBot() {

    console.log(`Bot token is ${bot_token}`);

    client.on(Events.ClientReady, async (client) => {
        console.log(`Logged as ${client.user.tag}!`);

        client.application?.commands.set(commandBuilders);

    })

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        console.log("RECEIVED MESSAGE")
        console.log(interaction.options.getString('message'))

        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });

    client.login(bot_token)

}

import {
    ChatInputCommandInteraction,
    Client, ClientEvents,
    CommandInteraction,
    Events,
    GatewayIntentBits,
    Interaction, InteractionReplyOptions, Message,
    MessageFlags, MessagePayload,
    Partials,
    REST, SlashCommandBuilder,
    MessageType
} from "discord.js";
import {DSBotCommand, ICommand} from "./ICommand.ts";
import loadCommands from "./commandsLoader.ts";
import registerCommands from "./commandsRegister.ts";
import {IMessageEvent} from "./IEvent.ts";
import {loadEvents} from "./events.loader.ts";


class DSBotService {

    private rawCommands: ICommand[];
    private commandRegister: Map<string, DSBotCommand>;
    private commandBuilders: SlashCommandBuilder[];

    private onMention: IMessageEvent;
    private onAnswer: IMessageEvent;

    public client: Client;

    private readonly botToken: string

    constructor(client?: Client, botToken: string = process.env.DISCORD_BOT_TOKEN!) {

        this.botToken = process.env.DISCORD_BOT_TOKEN!;

        this.botToken = botToken;
        if(!client)
            this.client = new Client({
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
        else this.client = client;

    }

    async loadCommands(commandsPath: string) {
        await loadCommands(commandsPath)
            .then((commands: ICommand[]) => {
                this.rawCommands = commands;
                registerCommands(commands).then(r => {
                    this.commandRegister = r.register;
                    this.commandBuilders = r.builder;
                });
            })
    }

    async loadEvents(eventsPath: string) {
        await loadEvents(eventsPath, this);
    }

    public on<Event extends keyof ClientEvents>(
        event: Event,
        listener: (...args: ClientEvents[Event]) => void,
    ){
        return this.client.on(event, listener);
    }

    async handleSlashCommand(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {

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


        const slashCommand = this.commandRegister.get(interaction.commandName)!;
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

    setOnMention(listener: IMessageEvent){
        this.onMention = listener;
    }
    setOnAnswer(listener: IMessageEvent){
        this.onAnswer = listener;
    }

    async handleAnswer(client: Client, message: Message): Promise<void> {}

    async startBot() {

        this.on(Events.ClientReady, async (client) => {
            console.log(`Logged as ${client.user.tag}!`);

            client.application?.commands.set(this.commandBuilders);

        })

        this.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            console.log("RECEIVED MESSAGE")
            console.log(interaction.options.getString('message'))

            if (interaction.isCommand()) {
                await this.handleSlashCommand(this.client, interaction);
            }
        });

        this.on(Events.MessageCreate, (message: Message) => {
            if(message.author.bot) return;

            if(message.type === MessageType.Reply) {
                return this.onAnswer.listener(message);
            } else if (message.mentions.has(this.client.user!)) {
                return this.onMention.listener(message);
            }
        });

        await this.client.login(
            this.botToken
        )

    }

}

export default DSBotService;

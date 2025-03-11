import {Client, Interaction, Message} from "discord.js";

interface IBot {

    onInteraction: (interaction: Interaction) => Promise<void>;
    onMessage: (message: Message) => Promise<void>;

    onReady: (client: Client) => Promise<void>;


}

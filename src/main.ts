
import path from "node:path";

console.log("BOT TOKEN IS ", process.env.DISCORD_BOT_TOKEN);
import {connectDB} from "./utils/mongodb.ts";
import {DSBotService} from "@apeyron-engineering/apeyron-ds-framework";
import {Client, GatewayIntentBits} from "discord.js";

await connectDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
    ]
})
const botService = new DSBotService(client);

await botService.loadCommands(path.join(__dirname, 'commands'));
await botService.loadEvents(path.join(__dirname, 'events'));

botService.startBot();

import DSBotService from "./ds_bot/bot.service.ts";
import path from "node:path";

console.log("BOT TOKEN IS ", process.env.DISCORD_BOT_TOKEN);
import {connectDB} from "./utils/mongodb.ts";

await connectDB();

const botService = new DSBotService();

await botService.loadCommands(path.join(__dirname, 'commands'));
await botService.loadEvents(path.join(__dirname, 'events'));

botService.startBot();

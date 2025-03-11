import {Client, Collection, GatewayIntentBits} from "discord.js";
import ICommand from "./ICommand.ts";
import loadCommands from "./classCommandsLoader.ts";

class BotService {
    private readonly client: Client;
    private readonly commands: Collection<string, ICommand>;

    constructor(client: Client) {
        console.log("Reading and assigning Commands ... ");
        this.client = client;
        this.commands = loadCommands();
    }



}

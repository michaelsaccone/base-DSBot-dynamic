import fs from "fs/promises";
import path from "node:path";
import {ClientEvents} from "discord.js";
import {BotEventListener, DSEventType, IMessageEvent} from "./IEvent.ts";
import DSBotService from "./bot.service.ts";


async function loadEvents(eventsFolderPath: string, botService: DSBotService) {
    const eventsFolder = (await fs.readdir(eventsFolderPath))
        .filter(file => file.endsWith('event.ts'));

    for (const nodeFile of eventsFolder) {
        const filePath = path.join(eventsFolderPath, nodeFile);

        const module = await import(filePath);

        if (!module || !module.default) continue;

        console.log("FOUND EVENT: ", nodeFile)

        const eventClass = module.default;

        let eventInstance: BotEventListener = new eventClass();
        const eventType: keyof ClientEvents | DSEventType = Reflect.getMetadata("event:eventType", eventInstance.constructor);

        console.log(`event ${nodeFile} is a ${eventType} event`);

        if (typeof eventType === typeof (DSEventType.ANSWER)) {
            if (eventType == DSEventType.MENTION) botService.setOnMention(eventInstance);
            else botService.setOnAnswer(eventInstance);
        }
        else {
            // @ts-ignore
            botService.on(eventType, eventInstance.listener )
        }

    }

}

export { loadEvents }

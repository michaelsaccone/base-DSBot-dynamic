import {ClientEvents} from "discord.js";
import { DSEventType } from "./IEvent.ts";

function DSEvent(eventType: ClientEvents | DSEventType ) {
    return function (constructor: Function) {
        Reflect.defineMetadata("event:eventType", eventType, constructor);
    };
}


export { DSEvent }

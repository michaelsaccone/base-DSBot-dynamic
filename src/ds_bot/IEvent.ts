import {ClientEvents, Message} from "discord.js"

enum DSEventType {
    MENTION = "mention",
    ANSWER = "answer"
}

interface BotEventListener {
    listener: (...args: any[]) => Promise<void>;
}
interface IMessageEvent extends BotEventListener {
    listener: (message: Message) => Promise<void>;
}

export { DSEventType, IMessageEvent, BotEventListener }

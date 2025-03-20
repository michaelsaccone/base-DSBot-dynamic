import {Message} from "discord.js";
import {DSEvent} from "../ds_bot/event.decorator.ts";
import {DSEventType, IMessageEvent} from "../ds_bot/IEvent.ts";
import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Runnable} from "@langchain/core/runnables";
import {StringOutputParser} from "@langchain/core/output_parsers";

@DSEvent(
    DSEventType.MENTION
)
class MentionEvent implements IMessageEvent {

    private readonly model: ChatOpenAI;
    private readonly prompt: ChatPromptTemplate;
    private readonly chain: Runnable;

    constructor() {
        this.model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.6
        });
        this.prompt = ChatPromptTemplate.fromTemplate(
            `
                You are a Discord Bot expert in Minecraft and Web Technology that helps people get to know APEYRON, our Community!
                Answer the message in a simple funny way, always in italian! 
                In your answers, always mention Apeyron, a Minecraft free community building the most big and free
                server in Italy!
                 
                User said: {message}
            `
        )
        this.chain = this.prompt
            .pipe(this.model)
            .pipe(new StringOutputParser())
    }

    async listener(message: Message) {
        console.log("Calling GPT with prompt: ", message.content)

        const answer: string = await this.chain.invoke({ message: message.content })

        await message.reply(answer);

    }

}

export default MentionEvent;

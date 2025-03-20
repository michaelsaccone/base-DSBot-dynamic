import { Client, ChatInputCommandInteraction, APIEmbed, EmbedBuilder } from "discord.js";
import { ChatOpenAI } from "@langchain/openai";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Runnable} from "@langchain/core/runnables";
import DSCommand from "../../ds_bot/inputCommand.decorator.ts";
import {BotCommandExecutor} from "../../ds_bot/ICommand.ts";

@DSCommand({
    name: "ai",
    description: "Richiama ChatGPT con un messaggio",
    responseFlag: undefined
})
class LlmCommand implements BotCommandExecutor {

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
                Answer the message in a funny way, in italian! \n {message}
            `
        )
        this.chain = this.prompt
            .pipe(this.model)
            .pipe(new StringOutputParser())

    }

    async execute(client: Client, interaction: ChatInputCommandInteraction, message: string) {

        console.log("CALLING CHAT GPT WITH PROMPT ", message)

        const answer: string = await this.chain.invoke({ message: message })

        return answer;
    }
}

export default new LlmCommand();

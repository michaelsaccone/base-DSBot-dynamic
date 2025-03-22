import {AttachmentBuilder, Message, MessageFlags, VoiceBasedChannel} from "discord.js";
import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Runnable} from "@langchain/core/runnables";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {DSEvent, DSEventType, IMessageEvent} from "@apeyron-engineering/apeyron-ds-framework";
import path from "node:path";
import {getAudio} from "../audio_ai/audio.service.ts";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from "@discordjs/voice";

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

        const audioPath = path.join(__dirname, 'temp.mp3')

        await getAudio(answer, audioPath)

        const channel = message.member!.voice.channel as VoiceBasedChannel;

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });

        const resource = createAudioResource(audioPath);
        player.play(resource);
        connection.subscribe(player);

        await message.reply("🎵 Te lo dico in vocale!");
        player.on("idle", () => {
            connection.destroy();
            console.log("Finished playing, leaving channel.");
        });

    }

}

export default MentionEvent;

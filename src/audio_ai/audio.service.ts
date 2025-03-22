import {ElevenLabsClient} from "elevenlabs";
import path from "node:path";
import * as fs from "node:fs";
const italianVoiceId = "W71zT1VwIFFx3mMGH2uZ";

console.log("ELEVEN API KEY: " + process.env.ELEVENLABS_API_KEY)

const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});

const userInfo = await client.user.get();

console.log("USER INFO: " + JSON.stringify(userInfo));

async function getAudio(text: string, filePath: string) {
    try {
        const audio = await client.textToSpeech.convertAsStream(italianVoiceId, {
            model_id: 'eleven_multilingual_v2',
            text,
            output_format: 'mp3_44100_128',
            // Optional voice settings that allow you to customize the output
            voice_settings: {
                stability: 0,
                similarity_boost: 0,
                use_speaker_boost: true,
                speed: 1.0,
            },
        });

        const fileName = (filePath);
        const fileStream = fs.createWriteStream(fileName);
        for await (const chunk of audio) {
            fileStream.write(chunk);
        }
    } catch (error) {
        console.log("Error while creating audio: ", error);
    }
}

export { getAudio }

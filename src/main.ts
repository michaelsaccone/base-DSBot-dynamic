import {startBot} from "./ds_bot/bot.service.ts";
import {connectDB} from "./utils/mongodb.ts";


await connectDB();

startBot()

// import { ChatOpenAI } from "@langchain/openai";
// import {ChatPromptTemplate} from "@langchain/core/prompts";
// import {StringOutputParser} from "@langchain/core/output_parsers";
//
// const model = new ChatOpenAI({
//     model: "gpt-4o-mini",
//     temperature: 0
// });
//
// const prompt = ChatPromptTemplate.fromTemplate("tell me a joke about {topic}");
//
// const chain = prompt.pipe(model).pipe(new StringOutputParser());
//
// console.log(await chain.invoke({ topic: "Cats" }))

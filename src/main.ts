import {startBot} from "./ds_bot/bot.service.ts";
import {connectDB} from "./utils/mongodb.ts";

import { z } from "zod";

//
// await connectDB();
//
// startBot()

import { tool } from "@langchain/core/tools";
import FractionSchema from "./ai_playground/schemas/Fraction.schema.ts";
import {ChatOpenAI} from "@langchain/openai";
import {StringOutputParser} from "@langchain/core/output_parsers";
import SubscribeSchema from "./ai_playground/schemas/Subscribe.schema.ts";
import {getSchemaDef} from "@axarai/axar";
import {BaseMessage, HumanMessage} from "@langchain/core/messages";
import {START, StateGraph} from "@langchain/langgraph";
import {buildStateGraph} from "./ai_playground/decorators/graphState.decorator.ts";
import TestMessageState from "./ai_playground/states/testMessage.state.ts";
import load_graph from "./ai_playground/graph.loader.ts";
import fs from "fs/promises";

const subscribeTool = tool(
    async (input: SubscribeSchema): Promise<string> => {
        console.log("CALLED TOOLS WITH ", input.email)
        return `User with email "${input.email}" subscribed!!`;
    },
    {
        name: "subscribe",
        description: "Subscribe email to the system, input is the email address",
        schema: getSchemaDef(SubscribeSchema)
    }
);
//
// const model = new ChatOpenAI({
//     model: "gpt-4o-mini",
//     temperature: 0.6
// });
//
// async function startNode(state: TestMessageState) {
//     console.log("STARTIN POINT")
//     state.name = "Michael";
//     state.messages = [ new HumanMessage("Repeat after me: weather is good!")]
//
//     return state;
// }
//
// async function secondStep(state: TestMessageState) {
//     console.log("SECOND STEP")
//     console.log("STATE IS ", state)
// }
//
//
// const workflow = buildStateGraph<TestMessageState>(new TestMessageState())
//     .addNode("agent", startNode)
//     .addNode("second", secondStep)
//     .addEdge(START, "agent")
//     .addEdge("agent", "second")
//
// const app = workflow.compile();



const workflow = await load_graph<TestMessageState>(new TestMessageState());
const app = workflow.compile();

const graph = await app.getGraphAsync();

const blob = await graph.drawMermaidPng();
const buffer = Buffer.from( await blob.arrayBuffer() );

await fs.writeFile('graph.png', buffer);

const finalState = await app.invoke({
    name: "Init name",
    args: [ "initial args" ]
})

console.log("FINAL STATE: ", finalState)

// const llmTools = model.bindTools([subscribeTool])
//
// const chain = llmTools.pipe(new StringOutputParser())
//
// const result = await llmTools.invoke(
//     "Subscribe the user antonio.faccioli@gmail.com to the system"
// )
//
// console.log(result)

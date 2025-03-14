import {CommandConfiguration, ICommand} from "../ds_bot/ICommand.ts";
import path from "node:path";
import fs from "fs/promises";
import ts from "typescript";
import {getFunctionParams} from "../utils/reflection.util.ts";
import {START, StateGraph} from "@langchain/langgraph";
import {buildStateGraph} from "./decorators/graphState.decorator.ts";

import "reflect-metadata"

async function load_graph<T>(state: T): Promise<StateGraph<T>> {

    const graph = buildStateGraph<T>(state)

    const foldersPath = path.join(__dirname, 'nodes');
    const nodesFolder = (await fs.readdir(foldersPath))
        .filter(file => file.endsWith('node.ts'));

    const conditionalEdges: Map<typeof START, Function> = new Map<typeof START, Function>();

    for (const nodeFile of nodesFolder) {
        const filePath = path.join(foldersPath, nodeFile);

        console.log("FOUND NODE: " + filePath);

        const module = await import(filePath);

        if(!module || !module.default) continue;

        console.log("MODULE: " + module);

        const nodeClass = module.default;


        console.log("NODE CLASS ", nodeClass);

        const id = Reflect.getMetadata("nodeId", nodeClass);

        console.log("NODE ID: " + id);

        const dependencies = Reflect.getMetadata("dependencies", nodeClass) || [];
        const followingNodes = Reflect.getMetadata("following", nodeClass) || [];
        const conditionalEdge = Reflect.getMetadata("conditionalEdge", nodeClass);

        if (id) {
            graph.addNode(id, async (state: T) => new nodeClass().execute(state));
        }

        for (const dep of dependencies) {
            graph.addEdge(dep, id);
        }

        if(conditionalEdge)
            conditionalEdges.set(id, conditionalEdge);
        else for (const fol of followingNodes) {
            console.log(`ADDING NEXT NODE: ${id} -> ${fol}`)
            graph.addEdge(id, fol);
        }

    }

    conditionalEdges.forEach((conditionalEdge, nodeId) => {
        graph.addConditionalEdges(nodeId, conditionalEdge);
    })

    return graph;

}
export default load_graph;

import {CommandConfiguration, ICommand} from "../ds_bot/ICommand.ts";
import path from "node:path";
import fs from "fs/promises";
import ts from "typescript";
import {getFunctionParams} from "../utils/reflection.util.ts";
import {StateGraph} from "@langchain/langgraph";
import {buildStateGraph} from "./decorators/graphState.decorator.ts";

import "reflect-metadata"

async function load_graph<T>(state: T): Promise<StateGraph<T>> {

    const graph = buildStateGraph<T>(state)

    const foldersPath = path.join(__dirname, 'nodes');
    const nodesFolder = (await fs.readdir(foldersPath))
        .filter(file => file.endsWith('node.ts'));

    for (const nodeFile of nodesFolder) {
        const filePath = path.join(foldersPath, nodeFile);

        console.log("FOUND NODE: " + filePath);

        const module = await import(filePath);

        console.log("MODULE: " + module);

        const nodeClass = module.default;


        console.log("NODE CLASS ", nodeClass);

        const id = Reflect.getMetadata("nodeId", nodeClass);

        console.log("NODE ID: " + id);

        const dependencies = Reflect.getMetadata("dependencies", nodeClass) || [];

        if (id) {
            graph.addNode(id, async (state: T) => new nodeClass().execute(state));
        }

        for (const dep of dependencies) {
            graph.addEdge(dep, id);
        }

    }

    return graph;

}
export default load_graph;

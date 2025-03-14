import {CompiledStateGraph, Graph, StateGraph} from "@langchain/langgraph";
import fs from "fs/promises";
import {buildStateGraph} from "../decorators/graphState.decorator.ts";

abstract class IGraph<TState> {
    state: TState;
    graph: StateGraph<TState>;
    _rawGraph: Graph;

    protected constructor(state: TState) {
        this.state = state;
        this.graph = buildStateGraph<TState>(state);
    }

    abstract build(): Promise<AgentGraph<TState>>;

}

class AgentGraph<TState> {

    agentName: string;

    constructor(
        private readonly buildGraph: CompiledStateGraph<TState, any>,
        name: string
    ) {
        this.agentName = name;
    }

    /**
     * Creates a local png file with the graph
     * */
    async draw() {
        const app = await this.buildGraph.getGraphAsync();
        const blob = await app.drawMermaidPng();
        const buffer = Buffer.from( await blob.arrayBuffer() );
        await fs.writeFile(`./${this.agentName}`, buffer);

        return this;
    }
}

export { IGraph, AgentGraph };

import TestMessageState from "../../states/testMessage.state.ts";
import {CompiledStateGraph, Graph, StateGraph} from "@langchain/langgraph";
import {buildStateGraph} from "../../decorators/graphState.decorator.ts";
import writerNode, {WRITER_NODE} from "../../nodes/writer.node.ts";
import fs from "fs/promises";
import {AgentGraph, IGraph} from "../../abstract/IGraph.ts";
import reviewNode, {REVIEW_NODE} from "../../nodes/review.node.ts";


class ImproverGraph extends IGraph<TestMessageState> {

    constructor() {
        super(new TestMessageState());
    }

    async build(): Promise<AgentGraph<TestMessageState>> {
        this.graph.addNode(WRITER_NODE, writerNode);
        this.graph.addNode(REVIEW_NODE, reviewNode);

        this.graph.addEdge()

        return new AgentGraph(
            this.graph.compile(),

        );
    }



    public addNodes(){


    }


}

export default ImproverGraph;

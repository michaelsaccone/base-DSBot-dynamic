import TestMessageState from "../states/testMessage.state.ts";
import {IGraphNode} from "../abstract/IGraphNode.ts";
import GraphNode from "../decorators/node.decorator.ts";
import {START} from "@langchain/langgraph";
import {HumanMessage} from "@langchain/core/messages";

export const WRITER_NODE = "writer";

@GraphNode({
    id: WRITER_NODE,
    dependsOn: [ START ]
})
class WriterNode implements IGraphNode<TestMessageState> {

    async execute(state: TestMessageState): Promise<TestMessageState> {

        state.name = "Michael Saccone";
        state.messages = [ new HumanMessage("FINE!") ]

        console.log("WRITER: STATE IS ")
        console.log(state)

        return state;

    }
}

export default WriterNode;

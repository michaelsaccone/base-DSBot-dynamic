import TestMessageState from "../states/testMessage.state.ts";
import {IGraphNode} from "../abstract/IGraphNode.ts";
import GraphNode from "../decorators/node.decorator.ts";
import {START} from "@langchain/langgraph";
import {HumanMessage} from "@langchain/core/messages";

export const WRITER_NODE = "writer";

@GraphNode({
    id: WRITER_NODE,
    dependsOn: [ START ],
    conditionalEdge(state: {name: string}) {
        if (state.name.includes("Attilio"))
            return "message"
        else return "comessage"
    }
})
class WriterNode implements IGraphNode<{ name: string }> {

    async execute(state: { name: string }): Promise<{ name: string }> {

        state.name = "Attilio Gilardo";

        console.log("WRITER: STATE IS ")
        console.log(state)

        return state;

    }
}

export default WriterNode;

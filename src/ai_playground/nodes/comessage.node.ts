import {IGraphNode} from "../abstract/IGraphNode.ts";
import TestMessageState from "../states/testMessage.state.ts";
import GraphNode from "../decorators/node.decorator.ts";
import {WRITER_NODE} from "./writer.node.ts";
import {AIMessage} from "@langchain/core/messages";

export const COMESSAGE_NODE = "comessage";

@GraphNode({
    id: COMESSAGE_NODE,
    dependsOn: [ WRITER_NODE ]
})
class ComessageNode implements IGraphNode<TestMessageState> {

    async execute(state: TestMessageState): Promise<TestMessageState> {

        state.messages =[ new AIMessage("I Shall add my opinion") ];

        return state;

    }

}

export default ComessageNode;

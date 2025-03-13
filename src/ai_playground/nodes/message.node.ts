import { IGraphNode } from "../abstract/IGraphNode.ts";
import TestMessageState from "../states/testMessage.state.ts";
import {AIMessage} from "@langchain/core/messages";
import GraphNode from "../decorators/node.decorator.ts";
import {WRITER_NODE} from "./writer.node.ts";

export const MESSAGE_NODE = "message";

@GraphNode({
    id: MESSAGE_NODE,
    dependsOn: [ WRITER_NODE ]
})
class MessageNode implements IGraphNode<TestMessageState> {


    async execute(state: TestMessageState): Promise<TestMessageState> {
        state.messages = [ new AIMessage("The weather is veeeery good!") ]

        return state;
    }

}

export default MessageNode;

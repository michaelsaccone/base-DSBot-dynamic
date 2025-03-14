import { IGraphNode } from "../abstract/IGraphNode.ts";
import TestMessageState from "../states/testMessage.state.ts";
import {AIMessage, BaseMessage} from "@langchain/core/messages";
import GraphNode from "../decorators/node.decorator.ts";
import {WRITER_NODE} from "./writer.node.ts";
import {END} from "@langchain/langgraph";

export const MESSAGE_NODE = "message";

@GraphNode({
    id: MESSAGE_NODE,
    dependsOn: [ WRITER_NODE ],
    forwardTo: [ END ]
})
class MessageNode implements IGraphNode<{ args: string[] }> {


    async execute(state: { args: string[] }): Promise<{ args: string[] }> {

        console.log(`MESSAGE NODE adding to ${state.args}`)

        state.args = [ "MESSAGE " ]

        return state;
    }

}

export default MessageNode;

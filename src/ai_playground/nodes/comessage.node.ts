import {IGraphNode} from "../abstract/IGraphNode.ts";
import TestMessageState from "../states/testMessage.state.ts";
import GraphNode from "../decorators/node.decorator.ts";
import {WRITER_NODE} from "./writer.node.ts";
import {AIMessage} from "@langchain/core/messages";
import {END} from "@langchain/langgraph";

export const COMESSAGE_NODE = "comessage";

@GraphNode({
    id: COMESSAGE_NODE,
    dependsOn: [ WRITER_NODE ],
    forwardTo: [ END ]
})
class ComessageNode implements IGraphNode<{ args: string[] }> {

    async execute(state: { args: string[] }): Promise<{ args: string[] }> {

        console.log(`IM COMESS adding to ${state.args}`);

        state.args =[ "CO_MESSAGE" ];

        return state;

    }

}

export default ComessageNode;

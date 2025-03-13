import {BaseMessage} from "@langchain/core/messages";
import {StateProperty} from "../decorators/graphState.decorator.ts";
import {StateGraph} from "@langchain/langgraph";


class TestMessageState {

    @StateProperty<BaseMessage[]>({
        reducer: (currentState, updateValue) => currentState.concat(updateValue),
        defaultValue: () => []
    })
    messages: BaseMessage[];

    @StateProperty()
    name: string;

    @StateProperty()
    surname: string;

}

export default TestMessageState;

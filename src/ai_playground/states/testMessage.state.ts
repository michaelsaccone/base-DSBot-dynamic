import {BaseMessage} from "@langchain/core/messages";
import {StateProperty} from "../decorators/graphState.decorator.ts";
import {StateGraph} from "@langchain/langgraph";

function arrayReducer(currentState: any[], updateValue: any[]) {
    if(updateValue !== currentState)
        return currentState.concat(updateValue)
    else return updateValue
}

class TestMessageState {

    @StateProperty<BaseMessage[]>({
        reducer: arrayReducer,
        defaultValue: () => []
    })
    messages: BaseMessage[];

    @StateProperty<string[]>({
        reducer: arrayReducer,
    })
    args: string[];

    @StateProperty({
        reducer: (currentState, updateValue) => currentState = updateValue,
    })
    name: string;

    @StateProperty()
    surname: string;

}

export default TestMessageState;

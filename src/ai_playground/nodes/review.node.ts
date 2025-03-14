

export const REVIEW_NODE = "review";

async function reviewNode(state: { text: string; isOk: boolean }) {

    console.log(`REVIEW_NODE: ${state.text}`);

    state.text = "revision: " + state.text;

    if(state.text.includes("revision:"))
        state.isOk = true;

    return state;

}

export default reviewNode;

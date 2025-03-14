

export const WRITER_NODE = "writer";

export default async function writerNode(state: { input: string; }) {
    console.log(`WRITER NODE: improving ${state.input}...`);

    state.input = "Improved version: " + state.input;

    return state;
}

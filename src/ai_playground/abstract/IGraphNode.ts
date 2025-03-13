

interface IGraphNode<T> {
    execute(state: T): Promise<T>;
}

export { IGraphNode };

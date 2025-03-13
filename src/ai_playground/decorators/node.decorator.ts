
// Node Decorator to register nodes and dependencies
function GraphNode(config: { id: string; dependsOn?: string[] }) {
    return function (target: any) {
        Reflect.defineMetadata("nodeId", config.id, target);
        Reflect.defineMetadata("dependencies", config.dependsOn || [], target);
    };
}

export default GraphNode;

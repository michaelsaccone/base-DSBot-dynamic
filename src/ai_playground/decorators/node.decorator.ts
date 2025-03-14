
// Node Decorator to register nodes and dependencies
function GraphNode(config: {
    id: string;
    dependsOn?: string[];
    forwardTo?: string[];
    conditionalEdge?: (state: any) => string;
}) {
    return function (target: any) {
        Reflect.defineMetadata("nodeId", config.id, target);
        Reflect.defineMetadata("dependencies", config.dependsOn || [], target);
        Reflect.defineMetadata("following", config.forwardTo || [], target);
        Reflect.defineMetadata("conditionalEdge", config.conditionalEdge || undefined, target);
    };
}

export default GraphNode;

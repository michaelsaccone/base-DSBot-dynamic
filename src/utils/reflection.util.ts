import ts from "typescript";
import {CommandParameter} from "../ds_bot/ICommand.ts";


function getFunctionParams(sourceFile: ts.SourceFile): CommandParameter[] {
    const params: { name: string; type: string }[] = [];

    function visit(node: ts.Node) {
        if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
            node.parameters.forEach(param => {
                const paramName = param.name.getText();
                const paramType = param.type ? param.type.getText() : 'any';
                params.push({ name: paramName, type: paramType });
            });
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return params;
}

export { getFunctionParams }

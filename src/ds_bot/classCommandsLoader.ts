import {Collection} from "discord.js";
import fs from 'fs/promises'
import * as path from "node:path"
import ts from 'typescript';
import "reflect-metadata"
import {BotCommand, CommandConfiguration, ICommand} from "./ICommand.ts";

async function __old__getFunctionParams(method: Function) {
    const params: { name: string; type: string }[] = [];

    const methodStr = method.toString();
    const sourceFile = ts.createSourceFile(
        "temp.ts",
        methodStr,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
    );

    function visit(node: ts.Node) {
        if (   ts.isFunctionDeclaration(node)
            || ts.isMethodDeclaration(node)
            || ts.isFunctionExpression(node)
            || ts.isArrowFunction(node)
            || ts.isFunctionTypeNode(node)
        ) {
            console.log("DETECTED FUNCTION NODE!")
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


function getMethodParams(classInstance: object, methodName: string): void {
    const classCode = classInstance.constructor.toString();
    const sourceFile = ts.createSourceFile(
        "temp.ts",
        classCode,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
    );

    function visit(node: ts.Node) {
        if (ts.isClassDeclaration(node) && node.name) {
            const className = node.name.getText(sourceFile);
            const method = node.members.find(
                member => ts.isMethodDeclaration(member) && member.name.getText(sourceFile) === methodName
            ) as ts.MethodDeclaration | undefined;

            if (method) {
                const params = method.parameters.map(param => {
                    const paramName = param.name.getText(sourceFile);
                    const paramType = param.type ? param.type.getText(sourceFile) : "any";
                    return `${paramName}: ${paramType}`;
                });
                console.log(`Class: ${className}, Method: ${methodName}, Parameters:`, params);
            } else {
                console.log(`Method '${methodName}' not found in class '${className}'.`);
            }
        }
        ts.forEachChild(node, visit);
    }

    ts.forEachChild(sourceFile, visit);
}

function getFunctionParams(sourceFile: ts.SourceFile) {
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

export default async function loadCommands(): Promise<Collection<string, ICommand>> {

    const commands: Collection<string, ICommand> = new Collection();

    const foldersPath = path.join(__dirname, 'old.commands');
    const commandFolders = await fs.readdir(foldersPath);

    console.log("Found folders", foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        console.log("Reading path ", commandsPath)
        const commandFiles = (await fs.readdir(commandsPath))
            .filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);

            const sourceCode = await fs.readFile(filePath, 'utf8');
            const sourceFile = ts.createSourceFile(file, sourceCode, ts.ScriptTarget.ESNext, true);

            const module = await import(filePath);

            const instance = module['default']

            console.log("FOUND MODULE")

            const commandConfiguration: CommandConfiguration =
                Reflect.getMetadata("command:configuration", instance.constructor)
            console.log(commandConfiguration)

            // const executor: any = module['default']['execute'];
            //
            // console.log("Found command", executor);
            //
            // console.log(`arguments: `, executor.arguments);

            console.log("Function parameters ")

            const params = getFunctionParams(sourceFile);

            if (params.length === 0) {
                console.log(`No function parameters found in ${file}`);
            } else {
                params.forEach(({ name, type }) => {
                    console.log(`  - ${name}: ${type}`);
                });
            }

            // getMethodParams(instance, "execute");

            // console.log(`  Parameters: ${JSON.stringify(params)}`)

        }
    }

    return commands;

}

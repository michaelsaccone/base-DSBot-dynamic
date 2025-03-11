import {Collection} from "discord.js";
import fs from 'fs/promises'
import * as path from "node:path"
import ts from 'typescript';
import "reflect-metadata"
import {BotCommandExecutor, CommandConfiguration, CommandParameter, ICommand} from "./ICommand.ts";

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

export default async function loadCommands(): Promise<ICommand[]> {

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = await fs.readdir(foldersPath);

    console.log("Found folders", foldersPath);

    const commands: ICommand[] = [];

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

            const execute = instance['execute'];

            const instanceMethod = instance.execute.bind(instance);

            const commandParametersDescriptions =
                Reflect.getMetadata("parameter:description", Object.getPrototypeOf(instance)) || {}

            const commandConfiguration: CommandConfiguration =
                Reflect.getMetadata("command:configuration", instance.constructor)

            const params = getFunctionParams(sourceFile);

            for (const key of Object.keys(commandParametersDescriptions)) {
                //  Key is the parameter index of the method
                // @ts-ignore
                params[key].description = commandParametersDescriptions[key];
            }

            console.log("PARAMETERS FOR " + commandConfiguration.name);
            console.log(params.slice(2))

            commands.push({
                name: commandConfiguration.name,
                description: commandConfiguration.description,
                responseFlag: commandConfiguration.responseFlag,
                execute: instanceMethod,
                parameters: params.slice(2) //  remove first two params,
            })

        }
    }

    return commands;

}

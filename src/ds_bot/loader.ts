import {Collection} from "discord.js";
import fs from 'fs/promises'
import * as path from "node:path"
import ts, {isFunctionDeclaration} from 'typescript';
import "reflect-metadata"
import {BotCommand, CommandConfiguration, ICommand} from "./ICommand.ts";

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

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = await fs.readdir(foldersPath);

    console.log("Found folders", foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        console.log("Reading path ", commandsPath)
        const commandFiles = (await fs.readdir(commandsPath))
            .filter(file => file.endsWith('command.ts'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);

            const sourceCode = await fs.readFile(filePath, 'utf8');
            const sourceFile = ts.createSourceFile(file, sourceCode, ts.ScriptTarget.ESNext, true);

            console.log("Found command file", filePath);

            const command: ICommand = (await import(filePath))['default'] as ICommand;

            console.log("Found command", command);

            console.log("Function parameters ")

            const params = getFunctionParams(sourceFile);

            if (params.length === 0) {
                console.log(`No function parameters found in ${file}`);
            } else {
                params.forEach(({ name, type }) => {
                    console.log(`  - ${name}: ${type}`);
                });
            }

        }
    }

    return commands;

}

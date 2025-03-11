
import "reflect-metadata"
import {CommandConfiguration} from "./ICommand.ts";
import {Client, CommandInteraction} from "discord.js";

/**
 * Class decorator to define a command
 * */
export function DSCommand(data: CommandConfiguration) {
    return function (constructor: Function) {
        Reflect.defineMetadata("command:configuration", data, constructor);
    };
}

export function BotExecutor(parametersDescription: {name: string, description: string}[]) {

    function decorator(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {

        const originalMethod = descriptor.value;

        Reflect.defineMetadata("param:configuration", parametersDescription, target);
        const paramTypes: any[] = Reflect.getMetadata("design:paramtypes", target, propertyKey);

        async function inputValidator(client: Client, interaction: CommandInteraction, args: any[]) {
            if (!Array.isArray(args)) {
                throw new Error(`Expected an array as argument, but got ${typeof args}`);
            }

            if (args.length !== paramTypes.length) {
                throw new Error(
                    `Expected ${paramTypes.length} arguments, but got ${args.length}`
                );
            }

            args.forEach((arg, index) => {

                const expectedType = paramTypes[index];
                if (
                    (typeof expectedType === "function" &&
                        !(arg instanceof expectedType) &&
                        typeof arg !== expectedType.name.toLowerCase())
                    || (expectedType === Array && !Array.isArray(arg))
                    || (expectedType != typeof arg)
                ) {
                    throw new TypeError(
                        `Argument at index ${index} expected to be of type ${expectedType.name}, but got ${typeof arg}`
                    );
                }
            });

            return originalMethod.apply(this, args);

        }

        return descriptor.value = inputValidator;

    }

    return decorator;

}

export function DSParam(description: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        const existingMetadata: Record<number, string> =
            Reflect.getOwnMetadata("parameter:description", target, propertyKey) || {};

        existingMetadata[parameterIndex] = description;

        Reflect.defineMetadata("parameter:description", existingMetadata, target);
    };
}

export default DSCommand;

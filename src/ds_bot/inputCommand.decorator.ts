
import "reflect-metadata"
import {CommandConfiguration} from "./ICommand.ts";

/**
 * Class decorator to define a command
 * */
export function DSCommand(data: CommandConfiguration) {
    return function (constructor: Function) {
        Reflect.defineMetadata("command:configuration", data, constructor);
    };
}

export default DSCommand;

import {getSchemaDef, hasSchemaDef, SchemaConstructor} from "@axarai/axar";
import { z, ZodSchema, ZodObject } from 'zod';

/**
 * `@tool` decorator to mark a method as a tool with a description and schema.
 * Supports both explicit ZodSchema and class-based schema derivation.
 *
 * Usage with ZodSchema:
 * @tool("Description", z.object({ ... }))
 *
 * Usage with class-based schema:
 * @tool("Description")
 * async method(params: ClassBasedParams): Promise<ReturnType> { ... }
 *
 * @param description - Description of the tool's functionality.
 * @param schemaOrClass - Optional Zod schema or class constructor.
 * @returns A method decorator function.
 */
export function tool(
    description: string,
    schemaOrClass?: SchemaConstructor,
): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor {
        if (typeof descriptor.value !== 'function') {
            throw new Error(
                `@tool can only be applied to methods, not to property '${String(
                    propertyKey,
                )}'.`,
            );
        }

        let schema: ZodSchema<any>;

        if (schemaOrClass) {
            if (schemaOrClass instanceof z.ZodSchema) {
                // Explicit Zod schema provided
                schema = schemaOrClass;
            } else if (hasSchemaDef(schemaOrClass)) {
                schema = getSchemaDef(schemaOrClass);
            } else {
                throw new Error(
                    `${schemaOrClass.name} must be either a Zod schema or a class decorated with @schema`,
                );
            }
        } else {
            // No schema provided, derive via reflection
            const paramTypes: any[] = Reflect.getMetadata(
                'design:paramtypes',
                target,
                propertyKey,
            );

            if (!paramTypes || paramTypes.length === 0) {
                // Empty parameter list, so we use an empty schema
                schema = z.object({});
            } else {
                const paramType = paramTypes[0];

                // Validate parameter count
                if (paramTypes.length > 1) {
                    throw new Error(
                        `@tool ${String(propertyKey)}: Expected a single parameter, but found ${paramTypes.length}.`,
                    );
                }

                // Exclude primitive types
                const primitiveTypes = [
                    String,
                    Number,
                    Boolean,
                    Symbol,
                    BigInt,
                    Function,
                ];
                if (primitiveTypes.includes(paramType)) {
                    throw new Error(
                        `@tool ${String(propertyKey)}: The parameter type (${paramType.name}) is a primitive, not an object.`,
                    );
                }

                // Ensure paramType is constructable and produces an object
                if (typeof paramType !== 'function' || !paramType.prototype) {
                    throw new Error(
                        `@tool ${String(propertyKey)}: The parameter type (${paramType.name}) is not a valid class or constructor.`,
                    );
                }

                // Check if paramType is a class decorated with @schema
                if (!hasSchemaDef(paramType)) {
                    throw new Error(
                        `@tool decorator on ${String(
                            propertyKey,
                        )} requires an explicit Zod schema or a parameter class decorated with @schema.`,
                    );
                }
                // Convert the parameter class to Zod schema
                schema = getSchemaDef(paramType);
            }
        }

        // Retrieve existing tools metadata or initialize an empty array
        const tools: ToolMetadata[] =
            Reflect.getMetadata(META_KEYS.TOOLS, target.constructor) || [];

        // Add the new tool to the metadata
        tools.push({
            name: String(propertyKey),
            description,
            method: String(propertyKey),
            parameters: schema as ZodObject<any>,
        });

        // Define the updated tools metadata on the constructor
        Reflect.defineMetadata(META_KEYS.TOOLS, tools, target.constructor);

        // Wrap the original method to validate input
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            if (args[0]) {
                schema.parse(args[0]); // This will throw if validation fails
            }
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

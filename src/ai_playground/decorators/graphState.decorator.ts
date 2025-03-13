import 'reflect-metadata';
import {Annotation, StateGraph} from "@langchain/langgraph";

const STATE_METADATA_KEY = Symbol('stateProperty');

interface StatePropertyChannel<T> {
    reducer?: (currentState: T, updateValue: T) => T,
    defaultValue?: () => T
}

interface StatePropertyMetadata<T> extends StatePropertyChannel<T> {
    type: T
}

export function StateProperty<T>(
    metadata: StatePropertyChannel<T> = {}
): PropertyDecorator {
    return function (target: any, propertyKey: string | symbol): void {
        const propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        const existingMetadata: Record<string, StatePropertyMetadata<T>> =
            Reflect.getMetadata(STATE_METADATA_KEY, target) || {};

        existingMetadata[propertyKey.toString()] = { ...metadata, type: propertyType };
        Reflect.defineMetadata(STATE_METADATA_KEY, existingMetadata, target);
    };
}

export function buildStateGraph<T>(target: any): StateGraph<T> {
    // @ts-ignore
    const metadata: Record<string, StatePropertyMetadata> =
        Reflect.getMetadata(STATE_METADATA_KEY, target) || {};

    const annotationObject: Record<string, any> = {};

    for (const [key, options] of Object.entries(metadata)) {
        annotationObject[key] = Annotation<InstanceType<typeof options.type>>({
            reducer: options.reducer,
            default: options.defaultValue,
        });
    }

    return new StateGraph(Annotation.Root(annotationObject));
}

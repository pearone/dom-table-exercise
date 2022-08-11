import 'reflect-metadata';

const requiredMetadataKey = Symbol('required');

export function validate(
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
) {
    let existingRequiredParameters: number[] =
        Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(
        requiredMetadataKey,
        existingRequiredParameters,
        target,
        propertyKey,
    );
}

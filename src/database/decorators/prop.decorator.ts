import { AttributeDefinition, AttributeType } from '../commons/dynamoose.types';
import { PROPS_METADATA_KEY, TYPE_METADATA_KEY } from '../constants/metadata.constants';

export function Prop(options?: AttributeDefinition): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    options = (options || {}) as AttributeDefinition;

    if (!options.type) {
      const type = Reflect.getMetadata(TYPE_METADATA_KEY, target, propertyKey);

      if (type === Array) {
        options.type = [];
      } else if (type && type !== Object) {
        options.type = type as AttributeType;
      } else {
        throw new Error(
          `Cannot determine type for property ${String(propertyKey)} in class ${target.constructor.name}. Please specify a type explicitly.`,
        );
      }
    }

    const props = Reflect.getMetadata(PROPS_METADATA_KEY, target.constructor) || {};
    props[propertyKey] = options;
    Reflect.defineMetadata(PROPS_METADATA_KEY, props, target.constructor);
  };
}

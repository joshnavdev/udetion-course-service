import { SchemaSettings } from '../commons/dynamoose.types';
import { OPTIONS_METADATA_KEY, TABLE_NAME_METADATA_KEY } from '../constants/metadata.constants';

export function Schema(tableName: string, options?: SchemaSettings) {
  return (target: Function) => {
    Reflect.defineMetadata(TABLE_NAME_METADATA_KEY, tableName, target);
    Reflect.defineMetadata(OPTIONS_METADATA_KEY, options, target);
  };
}

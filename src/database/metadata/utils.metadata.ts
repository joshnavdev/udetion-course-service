import { PROPS_METADATA_KEY, TABLE_NAME_METADATA_KEY } from '../constants/metadata.constants';
import { SchemaSettings } from '../commons/dynamoose.types';
import { Schema, SchemaDefinition } from 'dynamoose/dist/Schema';
import { SchemaClass } from '../interfaces/model.interface';

export const getTableNameMetadata = (target: SchemaClass | Schema): string => {
  const tableName = Reflect.getMetadata(TABLE_NAME_METADATA_KEY, target) as string;

  if (!tableName && typeof target === 'function') {
    throw new Error(`Table name not defined for ${target.name}`);
  }

  return tableName;
};

export const getOptionsMetadata = (target: Function): SchemaSettings => {
  return (Reflect.getMetadata(TABLE_NAME_METADATA_KEY, target) || {}) as SchemaSettings;
};

export const getPropsMetadata = (target: Function) => {
  const props = (Reflect.getMetadata(PROPS_METADATA_KEY, target) || {}) as SchemaDefinition;

  if (Object.keys(props).length === 0) {
    throw new Error('No properties defined for ' + target.name);
  }

  return props;
};

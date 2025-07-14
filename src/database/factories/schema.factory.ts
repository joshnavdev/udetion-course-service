import { Schema } from 'dynamoose/dist/Schema';
import { getOptionsMetadata, getPropsMetadata, getTableNameMetadata } from '../metadata/utils.metadata';
import { SchemaClass } from '../interfaces/model.interface';
import * as dynamoose from 'dynamoose';
import { TABLE_NAME_METADATA_KEY } from '../constants/metadata.constants';

export class SchemaFactory {
  static createFromClass(model: SchemaClass): Schema {
    const tableName = getTableNameMetadata(model);
    const props = getPropsMetadata(model);
    const options = getOptionsMetadata(model);

    const schema = new dynamoose.Schema(props, options);
    Reflect.defineMetadata(TABLE_NAME_METADATA_KEY, tableName, schema);

    return schema;
  }
}

import * as dynamoose from 'dynamoose';
import { Provider } from '@nestjs/common';
import { getModelToken } from './commons/dynamoose.utils';
import { getTableNameMetadata } from './metadata/utils.metadata';
import { Schema } from 'dynamoose/dist/Schema';

export function createDynamooseProviders(schemas: Schema[]): Provider[] {
  return schemas.map((schema) => {
    const tableName = getTableNameMetadata(schema);

    return {
      provide: getModelToken(tableName),
      useFactory: () => {
        const model = dynamoose.model(tableName, schema);
        return model;
      },
    };
  });
}

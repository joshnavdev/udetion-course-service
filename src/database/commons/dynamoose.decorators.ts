import { Inject } from '@nestjs/common';
import { getModelToken } from './dynamoose.utils';
import { SchemaClass } from '../interfaces/model.interface';

export const InjectModel = (model: SchemaClass) => {
  const modelName = Reflect.getMetadata('dynamoose:tableName', model);
  return Inject(getModelToken(modelName));
};

import { DynamicModule, Module } from '@nestjs/common';
import { createDynamooseProviders } from './database.providers';
import { Schema } from 'dynamoose/dist/Schema';

@Module({})
export class DatabaseModule {
  static forFeature(models: Schema[]): DynamicModule {
    const providers = createDynamooseProviders(models);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

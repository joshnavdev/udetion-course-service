import { DynamicModule, Module } from '@nestjs/common';
import { Schema } from 'dynamoose/dist/Schema';
import { createDynamooseProviders } from './database.providers';
import { DynamooseModuleAsyncOptions, DynamooseModuleOptions } from './interfaces/dynamoose.interface';
import { DatabaseCoreModule } from './database-core.module';

@Module({})
export class DatabaseModule {
  static forRoot(options: DynamooseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DatabaseCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: DynamooseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DatabaseCoreModule.forRootAsync(options)],
    };
  }

  static forFeature(models: Schema[]): DynamicModule {
    const providers = createDynamooseProviders(models);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

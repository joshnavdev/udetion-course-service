import { DynamicModule, Global, Module } from '@nestjs/common';
import { aws } from 'dynamoose';
import { DynamooseModuleAsyncOptions, DynamooseModuleOptions } from './interfaces/dynamoose.interface';
import { DYNAMOOSE_INITIALIZATION } from './constants/dynamoose.constants';

function initialization(options: DynamooseModuleOptions) {
  if (options.aws) {
    aws.ddb.set(new aws.ddb.DynamoDB(options.aws));
  }

  if (options.local) {
    if (typeof options.local === 'boolean') {
      aws.ddb.local();
    } else {
      aws.ddb.local(options.local);
    }
  }
}

@Global()
@Module({})
export class DatabaseCoreModule {
  static forRoot(options: DynamooseModuleOptions): DynamicModule {
    const initialProvider = {
      provide: DYNAMOOSE_INITIALIZATION,
      useFactory: () => initialization(options),
    };

    return {
      module: DatabaseCoreModule,
      providers: [initialProvider],
      exports: [initialProvider],
    };
  }

  static forRootAsync(asyncOptions: DynamooseModuleAsyncOptions): DynamicModule {
    const initialProvider = {
      provide: DYNAMOOSE_INITIALIZATION,
      useFactory: async (...args: any[]) => {
        if (!asyncOptions.useFactory) {
          throw new Error('DynamooseModuleAsyncOptions must have a useFactory function');
        }

        const options = await asyncOptions.useFactory(...args);
        initialization(options);
      },
      inject: asyncOptions.inject || [],
    };

    return {
      module: DatabaseCoreModule,
      providers: [initialProvider],
      exports: [initialProvider],
    };
  }
}

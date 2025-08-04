import { ModuleMetadata } from '@nestjs/common';

export interface DynamooseModuleOptions {
  aws?: {
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      sessionToken?: string;
    };
    region?: string;
  };
  local?: boolean | string;
}

export interface DynamooseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<DynamooseModuleOptions> | DynamooseModuleOptions;
  inject?: any[];
}

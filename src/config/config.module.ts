import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configValidationSchema } from './validation';
import appConfig from './app.config';
import awsConfig from './aws.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      load: [appConfig, awsConfig],
    }),
  ],
})
export class ConfigModule {}

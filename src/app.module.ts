import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { CourseModule } from './course/interface/course.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from './config/aws.config';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const awsConfig = configService.get<AwsConfig>('aws');

        if (!awsConfig) {
          throw new Error('AWS configuration is not defined');
        }

        return {
          aws: {
            credentials: {
              accessKeyId: awsConfig.credentials.accessKeyId,
              secretAccessKey: awsConfig.credentials.secretAccessKey,
              sessionToken: awsConfig.credentials.sessionToken!,
            },
            region: awsConfig.region!,
          },
        };
      },
      inject: [ConfigService],
    }),
    CourseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

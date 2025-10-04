import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseServiceImpl } from '../application/services/course.service.impl';
import { COURSE_REPOSITORY, COURSE_SCRAPPER_PORT, COURSE_SERVICE, COURSE_SERVICE_PRODUCER } from '../domain/constants';
import { courseSchema } from '../infraestructure/database/entities/courseOrm.entity';
import { CourseRepositoryImpl } from '../infraestructure/database/repositories/course.repository.impl';
import { DatabaseModule } from '../../database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../../config/kafka.config';
import { CourseScrapperAdapter } from '../infraestructure/adapters/courseScrapper.adapter';

@Module({
  imports: [
    DatabaseModule.forFeature([courseSchema]),
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: COURSE_SERVICE_PRODUCER,
        useFactory: (configService: ConfigService) => {
          const kafkaConfig = configService.get<KafkaConfig>('kafka');

          if (!kafkaConfig) {
            throw new Error('Kafka configuration is missing');
          }

          return {
            transport: Transport.KAFKA,
            options: {
              client: { clientId: 'course-service', brokers: kafkaConfig.brokers },
              consumer: { groupId: 'course-service-consumer' },
            },
          };
        },
      },
    ]),
  ],
  controllers: [CourseController],
  providers: [
    {
      provide: COURSE_SERVICE,
      useClass: CourseServiceImpl,
    },
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseRepositoryImpl,
    },
    {
      provide: COURSE_SCRAPPER_PORT,
      useClass: CourseScrapperAdapter,
    },
  ],
})
export class CourseModule {}

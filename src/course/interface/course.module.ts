import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseServiceImpl } from '../application/services/course.service.impl';
import { COURSE_REPOSITORY, COURSE_SERVICE } from '../domain/constants/tokens';
import { courseSchema } from '../infraestructure/database/entities/courseOrm.entity';
import { CourseRepositoryImpl } from '../infraestructure/database/repositories/course.repository.impl';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule.forFeature([courseSchema])],
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
  ],
})
export class CourseModule {}

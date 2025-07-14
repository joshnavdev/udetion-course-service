import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { CourseModule } from './course/interface/course.module';

@Module({
  imports: [ConfigModule, CourseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

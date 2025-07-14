import { CourseService } from '../../domain/services/course.service';
import { SearchCourseDto } from '../../domain/dtos/searchCourse.dto';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { Inject } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../domain/constants/tokens';

export class CourseServiceImpl implements CourseService {
  constructor(@Inject(COURSE_REPOSITORY) private readonly courseRepository: CourseRepository) {}

  searchCourse(query: SearchCourseDto): Promise<CourseEntity[]> {
    return this.courseRepository.findAllByUrl(query.url);
  }
}

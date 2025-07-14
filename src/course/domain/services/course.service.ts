import { SearchCourseDto } from '../dtos/searchCourse.dto';
import { CourseEntity } from '../entities/course.entity';

export interface CourseService {
  searchCourse(query: SearchCourseDto): Promise<CourseEntity[]>;
}

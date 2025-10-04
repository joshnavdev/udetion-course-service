import { CourseEntity } from '../entities/course.entity';

export interface CourseRepository {
  findAllByUrl(url: string): Promise<CourseEntity[]>;
  save(course: CourseEntity): Promise<CourseEntity>;
}

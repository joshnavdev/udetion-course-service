import { CourseScrap } from '../dtos/courseScrap.dto';

export interface CourseScrapperPort {
  scrapeCourse(url: string): Promise<CourseScrap>;
}

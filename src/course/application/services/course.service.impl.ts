import { CourseService } from '../../domain/services/course.service';
import { SearchCourseDto } from '../../domain/dtos/searchCourse.dto';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { COURSE_REPOSITORY, COURSE_SCRAPPER_PORT } from '../../domain/constants';
import { CourseScrapperPort } from '../../domain/services/courseScrapper.port';

export class CourseServiceImpl implements CourseService {
  private readonly logger = new Logger(CourseServiceImpl.name);

  constructor(
    @Inject(COURSE_REPOSITORY) private readonly courseRepository: CourseRepository,
    @Inject(COURSE_SCRAPPER_PORT) private readonly courseScrapperService: CourseScrapperPort,
  ) {}

  async searchCourse(query: SearchCourseDto): Promise<CourseEntity[]> {
    const courses = await this.courseRepository.findAllByUrl(query.url);
    let course: CourseEntity | null = null;

    if (courses.length > 0) {
      return courses;
    }

    this.logger.warn(`No courses found for URL: ${query.url}`);
    this.logger.log('Emit event to scrape the course');

    const courseScrap = await this.courseScrapperService.scrapeCourse(query.url);

    if (!courseScrap) throw new NotFoundException('Course not found');

    if (!courseScrap.id || !courseScrap.url) {
      this.logger.error('Scraped course data is missing required fields: id or url');
      throw new NotFoundException('Course not found');
    }

    course = await this.courseRepository.save(courseScrap);

    return [course];
  }
}

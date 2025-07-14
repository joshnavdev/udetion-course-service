import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CourseService } from '../../domain/services/course.service';
import { SearchCourseValidatorDto } from '../dtos/searchCourseValidator.dto';
import { CourseEntity } from '../../domain/entities/course.entity';
import { COURSE_SERVICE } from '../../domain/constants/tokens';

@Controller('courses')
export class CourseController {
  constructor(@Inject(COURSE_SERVICE) private readonly courseService: CourseService) {}

  @Post('search')
  searchCourses(@Body() searchCourseDto: SearchCourseValidatorDto): Promise<CourseEntity[]> {
    return this.courseService.searchCourse(searchCourseDto);
  }
}

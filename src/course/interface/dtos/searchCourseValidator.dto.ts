import { SearchCourseDto } from '../../domain/dtos/searchCourse.dto';
import { IsUrl } from 'class-validator';

export class SearchCourseValidatorDto implements SearchCourseDto {
  @IsUrl()
  url: string;
}

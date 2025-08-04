import { CourseRepository } from '../../../domain/repositories/course.repository';
import { CourseEntity } from '../../../domain/entities/course.entity';
import { CourseOrmEntity } from '../entities/courseOrm.entity';
import { InjectModel } from '../../../../database/commons/dynamoose.decorators';
import { Item } from 'dynamoose/dist/Item';
import { ModelType } from 'dynamoose/dist/General';

export class CourseRepositoryImpl implements CourseRepository {
  constructor(@InjectModel(CourseOrmEntity) private readonly courseModel: ModelType<CourseOrmEntity & Item>) {}

  async findAllByUrl(url: string): Promise<CourseEntity[]> {
    const course = await this.courseModel.query('url').eq(url).using('url-index').exec();
    return course;
  }
}

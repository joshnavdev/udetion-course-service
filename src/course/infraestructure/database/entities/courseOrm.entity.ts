import { CourseEntity } from '../../../domain/entities/course.entity';
import { Prop } from '../../../../database/decorators/prop.decorator';
import { Schema } from '../../../../database/decorators/schema.decorator';
import { ModuleOrmEntity, moduleSchema } from './moduleOrm.entity';
import { SchemaFactory } from '../../../../database/factories';

@Schema('udemy-course')
export class CourseOrmEntity implements CourseEntity {
  @Prop()
  id: number;

  @Prop()
  title: string;

  @Prop({ type: String, index: { name: 'url-index', type: 'global' } })
  url: string;

  @Prop({ type: Array, schema: [moduleSchema] })
  modules: ModuleOrmEntity[];
}

export const courseSchema = SchemaFactory.createFromClass(CourseOrmEntity);

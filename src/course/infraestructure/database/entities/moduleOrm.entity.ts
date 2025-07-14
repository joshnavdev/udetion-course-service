import { ModuleEntity } from '../../../domain/entities/module.entity';
import { Prop } from '../../../../database/decorators/prop.decorator';
import { TopicOrmEntity, topicSchema } from './topicOrm.entity';
import { ObjectFactory } from '../../../../database/factories';

export class ModuleOrmEntity implements ModuleEntity {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  time: string;

  @Prop({ type: Array, schema: [topicSchema] })
  topics: TopicOrmEntity[];
}

export const moduleSchema = ObjectFactory.createFromClass(ModuleOrmEntity);

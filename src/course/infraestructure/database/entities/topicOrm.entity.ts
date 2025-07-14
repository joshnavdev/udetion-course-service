import { TopicEntity } from '../../../domain/entities/topic.entity';
import { Prop } from '../../../../database/decorators/prop.decorator';
import { ObjectFactory } from '../../../../database/factories';

export class TopicOrmEntity implements TopicEntity {
  @Prop()
  time: string;

  @Prop()
  title: string;
}

export const topicSchema = ObjectFactory.createFromClass(TopicOrmEntity);

import { SchemaClass } from '../interfaces/model.interface';
import { getOptionsMetadata, getPropsMetadata } from '../metadata/utils.metadata';
import * as dynamoose from 'dynamoose';

export class ObjectFactory {
  static createFromClass(model: SchemaClass) {
    const props = getPropsMetadata(model);
    const options = getOptionsMetadata(model);

    console.log({ props, options });

    return new dynamoose.Schema(props, options);
  }
}

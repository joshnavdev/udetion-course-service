import * as joi from 'joi';
import { EnvironmentEnum } from './app.config';

export const configValidationSchema = joi.object({
  NODE_ENV: joi.string().default(EnvironmentEnum.DEV),
  AWS_ACCESS_KEY_ID: joi.string().required(),
  AWS_SECRET_ACCESS_KEY: joi.string().required(),
  AWS_SESSION_TOKEN: joi.string(),
  AWS_REGION: joi.string().default('us-east-1'),
  KAFKA_BROKER_0: joi.string().required(),
});

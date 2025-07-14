import * as joi from 'joi';
import { EnvironmentEnum } from './app.config';

export const configValidationSchema = joi.object({
  NODE_ENV: joi.string().default(EnvironmentEnum.DEV),
});

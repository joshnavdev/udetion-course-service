import { Item } from 'dynamoose/dist/Item';

export type SchemaClass<T extends Item = any> = new (...args: any[]) => T;

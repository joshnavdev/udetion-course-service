import { ModelType, ObjectType } from 'dynamoose/dist/General';
import { Item } from 'dynamoose/dist/Item';
import { IndexType, Schema, SchemaDefinition, TimestampObject, ValueType } from 'dynamoose/dist/Schema';

export type AttributeType =
  | string
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor
  | typeof Buffer
  | DateConstructor
  | ObjectConstructor
  | ArrayConstructor
  | SetConstructor
  | symbol
  | Schema
  | ModelType<Item>;

interface IndexDefinition {
  /**
   * The name of the index.
   * @default `${attribute}${type == "global" ? "GlobalIndex" : "LocalIndex"}`
   */
  name?: string;
  /**
   * If the index should be a global index or local index. Attribute will be the hashKey for the index.
   * @default "global"
   */
  type?: IndexType | keyof typeof IndexType;
  /**
   * The range key attribute name for a global secondary index.
   */
  rangeKey?: string;
  /**
   * Sets the attributes to be projected for the index. `true` projects all attributes, `false` projects only the key attributes, and an array of strings projects the attributes listed.
   * @default true
   */
  project?: boolean | string[];
  /**
   * Sets the throughput for the global secondary index.
   * @default undefined
   */
  throughput?:
    | 'ON_DEMAND'
    | number
    | {
        read: number;
        write: number;
      };
}

export interface AttributeDefinitionTypeSettings {
  storage?: 'milliseconds' | 'seconds' | 'iso';
  model?: ModelType<Item>;
  attributes?: string[];
  separator?: string;
  value?: string | boolean | number;
}

export interface AttributeDefinition {
  /**
   * The type attribute can either be a type (ex. `Object`, `Number`, etc.) or an object that has additional information for the type. In the event you set it as an object you must pass in a `value` for the type, and can optionally pass in a `settings` object.
   *
   * ```js
   * {
   * 	"address": {
   * 		"type": Object
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"deletedAt": {
   * 		"type": {
   * 			"value": Date,
   * 			"settings": {
   * 				"storage": "seconds" // Default: milliseconds (as shown above)
   * 			}
   * 		}
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"data": {
   * 		"type": {
   * 			"value": "Constant",
   * 			"settings": {
   * 				"value": "Hello World" // Any `data` attribute must equal `Hello World` now.
   * 			}
   * 		}
   * 	}
   * }
   * ```
   */
  type:
    | AttributeType
    | AttributeType[]
    | {
        value: DateConstructor;
        settings?: AttributeDefinitionTypeSettings;
      }
    | {
        value: AttributeType | AttributeType[];
      };
  /**
   * This property is only used for the `Object` or `Array` attribute types. It is used to define the schema for the underlying nested type. For `Array` attribute types, this value must be an `Array` with one element defining the schema. This element for `Array` attribute types can either be another raw Dynamoose type (ex. `String`), or an object defining a more detailed schema for the `Array` elements. For `Object` attribute types this value must be an object defining the schema. Some examples of this property in action can be found below.
   *
   * ```js
   * {
   * 	"address": {
   * 		"type": Object,
   * 		"schema": {
   * 			"zip": Number,
   * 			"country": {
   * 				"type": String,
   * 				"required": true
   * 			}
   * 		}
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"friends": {
   * 		"type": Array,
   * 		"schema": [String]
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"friends": {
   * 		"type": Array,
   * 		"schema": [{
   * 			"type": Object,
   * 			"schema": {
   * 				"zip": Number,
   * 				"country": {
   * 					"type": String,
   * 					"required": true
   * 				}
   * 			}
   * 		}]
   * 	}
   * }
   * ```
   *
   * You can also define an array attribute that accepts more than one data type. The following example will allow the `friends` attribute to be an array of strings, or an array of numbers, but the elements in the array must all be strings or must all be numbers.
   *
   * ```js
   * {
   * 	"friends": {
   * 		"type": Array,
   * 		"schema": [
   * 			{
   * 				"type": Array,
   * 				"schema": [String]
   * 			},
   * 			{
   * 				"type": Array,
   * 				"schema": [Number]
   * 			}
   * 		]
   * 	}
   * }
   * ```
   */
  schema?:
    | AttributeType
    | AttributeType[]
    | AttributeDefinition
    | AttributeDefinition[]
    | SchemaDefinition
    | SchemaDefinition[];
  /**
   * You can set a default value for an attribute that will be applied upon save if the given attribute value is `null` or `undefined`. The value for the default property can either be a value or a function that will be executed when needed that should return the default value. By default there is no default value for attributes.
   *
   * Default values will only be applied if the parent object exists. This means for values where you apply a `default` value to a nested attribute, it will only be applied if the parent object exists. If you do not want this behavior, consider setting a `default` value for the parent object to an empty object (`{}`) or an empty array (`[]`).
   *
   * ```js
   * {
   * 	"age": {
   * 		"type": Number,
   * 		"default": 5
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"age": {
   * 		"type": Number,
   * 		"default": () => 5
   * 	}
   * }
   * ```
   *
   * You can also pass in async functions or a function that returns a promise to the default property and Dynamoose will take care of waiting for the promise to resolve before saving the object.
   *
   * ```js
   * {
   * 	"age": {
   * 		"type": Number,
   * 		"default": async () => {
   * 			const networkResponse = await axios("https://myurl.com/config.json").data;
   * 			return networkResponse.defaults.age;
   * 		}
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"age": {
   * 		"type": Number,
   * 		"default": () => {
   * 			return new Promise((resolve) => {
   * 				setTimeout(() => resolve(5), 1000);
   * 			});
   * 		}
   * 	}
   * }
   * ```
   */
  default?: ValueType | (() => ValueType);
  /**
   * You can set this property to always use the `default` value, even if a value is already set. This can be used for data that will be used as sort or secondary indexes. The default for this property is false.
   *
   * ```js
   * {
   * 	"age": {
   * 		"type": Number,
   * 		"default": 5,
   * 		"forceDefault": true
   * 	}
   * }
   * ```
   */
  forceDefault?: boolean;
  /**
   * You can set a validation on an attribute to ensure the value passes a given validation before saving the item. In the event you set this to be a function or async function, Dynamoose will pass in the value for you to validate as the parameter to your function. Validation will only be run if the item exists in the item. If you'd like to force validation to be run every time (even if the attribute doesn't exist in the item) you can enable `required`.
   *
   * ```js
   * {
   * 	"age": {
   * 		"type": Number,
   * 		"validate": 5 // Any object that is saved must have the `age` property === to 5
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"id": {
   * 		"type": String,
   * 		"validate": /ID_.+/gu // Any object that is saved must have the `id` property start with `ID_` and have at least 1 character after it
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"age": {
   * 		"type": String,
   * 		"validate": (val) => val > 0 && val < 100 // Any object that is saved must have the `age` property be greater than 0 and less than 100
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"email": {
   * 		"type": String,
   * 		"validate": async (val) => {
   * 			const networkRequest = await axios(`https://emailvalidator.com/${val}`);
   * 			return networkRequest.data.isValid;
   * 		} // Any object that is saved will call this function and run the network request with `val` equal to the value set for the `email` property, and only allow the item to be saved if the `isValid` property in the response is true
   * 	}
   * }
   * ```
   */
  validate?: ValueType | RegExp | ((value: ValueType) => boolean | Promise<boolean>);
  /**
   * You can set an attribute to be required when saving items to DynamoDB. By default this setting is `false`.
   *
   * In the event the parent object is undefined and `required` is set to `false` on that parent attribute, the required check will not be run on child attributes.
   *
   * ```js
   * {
   * 	"email": {
   * 		"type": String,
   * 		"required": true
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"data": {
   * 		"type": Object,
   * 		"schema": {
   * 			"name": {
   * 				"type": String,
   * 				"required": true // Required will only be checked if `data` exists and is not undefined
   * 			}
   * 		}
   * 		"required": false
   * 	}
   * }
   * ```
   */
  required?: boolean;
  /**
   * You can set an attribute to have an enum array, which means it must match one of the values specified in the enum array. By default this setting is undefined and not set to anything.
   *
   * This property is not a replacement for `required`. If the value is undefined or null, the enum will not be checked. If you want to require the property and also have an `enum` you must use both `enum` & `required`.
   *
   * ```js
   * {
   * 	"name": {
   * 		"type": String,
   * 		"enum": ["Tom", "Tim"] // `name` must always equal "Tom" or "Tim"
   * 	}
   * }
   * ```
   */
  enum?: ValueType[];
  /**
   * You can use a get function on an attribute to be run whenever retrieving an item from DynamoDB. This function will only be run if the item exists in the item. Dynamoose will pass the DynamoDB value into this function and you must return the new value that you want Dynamoose to return to the application.
   *
   * ```js
   * {
   * 	"id": {
   * 		"type": String,
   * 		"get": (value) => `applicationid-${value}` // This will prepend `applicationid-` to all values for this attribute when returning from the database
   * 	}
   * }
   * ```
   */
  get?: (value: ValueType) => ValueType;
  /**
   * You can use a set function on an attribute to be run whenever saving an item to DynamoDB. It will also be used when retrieving an item based on this attribute (ie. `get`, `query`, `update`, etc). This function will only be run if the attribute exists in the item. Dynamoose will pass the value you provide into this function and you must return the new value that you want Dynamoose to save to DynamoDB.
   *
   * ```js
   * {
   * 	"name": {
   * 		"type": String,
   * 		"set": (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}` // Capitalize first letter of name when saving to database
   * 	}
   * }
   * ```
   *
   * Unlike `get`, this method will additionally pass in the original value as the second parameter (if available). Internally Dynamoose uses the [`item.original()`](/guide/Item#itemoriginal) method to access the original value. This means that using [`Model.batchPut`](/guide/Model#modelbatchputitems-settings-callback), [`Model.update`](/guide/Model#modelupdatekey-updateobj-settings-callback) or any other item save method that does not have access to [`item.original()`](/guide/Item#itemoriginal) this second parameter will be `undefined`.
   *
   * ```js
   * {
   * 	"name": {
   * 		"type": String,
   * 		"set": (newValue, oldValue) => `${newValue.charAt(0).toUpperCase()}${newValue.slice(1)}-${oldValue.charAt(0).toUpperCase()}${oldValue.slice(1)}` // Prepend the newValue to the oldValue (split by a `-`) and capitalize first letter of each when saving to database
   * 	}
   * }
   * ```
   */
  set?: (value: ValueType, oldValue?: ValueType) => ValueType | Promise<ValueType>;
  /**
   * Indexes on your DynamoDB tables must be defined in your Dynamoose schema. If you have the update option set to true on your model settings, and a Dynamoose schema index does not already exist on the DynamoDB table, it will be created on model initialization. Similarly, indexes on your DynamoDB table that do not exist in your Dynamoose schema will be deleted.
   *
   * If you pass in an array for the value of this setting it must be an array of index objects. By default no indexes are specified on the attribute.
   *
   * Your index object can contain the following properties:
   *
   * | Name | Type | Default | Notes |
   * |---|---|---|---|
   * | name | string | `${attribute}${type == "global" ? "GlobalIndex" : "LocalIndex"}` | The name of the index. |
   * | type | "global" \| "local" | "global" | If the index should be a global index or local index. Attribute will be the hashKey for the index. |
   * | rangeKey | string | undefined | The range key attribute name for a global secondary index. |
   * | project | boolean \| [string] | true | Sets the attributes to be projected for the index. `true` projects all attributes, `false` projects only the key attributes, and an array of strings projects the attributes listed. |
   * | throughput | number \| `{read: number, write: number}` | undefined | Sets the throughput for the global secondary index. |
   *
   *
   * If you set `index` to `true`, it will create an index with all of the default settings.
   *
   * ```js
   * {
   * 	"id": {
   * 		"hashKey": true,
   * 		"type": String,
   * 	},
   * 	"email": {
   * 		"type": String,
   * 		"index": {
   * 			"name": "emailIndex",
   * 			"global": true
   * 		} // creates a global secondary index with the name `emailIndex` and hashKey `email`
   * 	}
   * }
   * ```
   *
   * ```js
   * {
   * 	"id": {
   * 		"hashKey": true,
   * 		"type": String,
   * 		"index": {
   * 			"name": "emailIndex",
   * 			"rangeKey": "email",
   * 			"throughput": {"read": 5, "write": 10}
   * 		} // creates a local secondary index with the name `emailIndex`, hashKey `id`, rangeKey `email`
   * 	},
   * 	"email": {
   * 		"type": String
   * 	}
   * }
   * ```
   */
  index?: boolean | IndexDefinition | IndexDefinition[];
  /**
   * You can set this to true to overwrite what the `hashKey` for the Model will be. By default the `hashKey` will be the first key in the Schema object.
   *
   * `hashKey` is commonly called a `partition key` in the AWS documentation.
   *
   * ```js
   * {
   * 	"id": String,
   * 	"key": {
   * 		"type": String,
   * 		"hashKey": true
   * 	}
   * }
   * ```
   */
  hashKey?: boolean;
  /**
   * You can set this to true to overwrite what the `rangeKey` for the Model will be. By default the `rangeKey` won't exist.
   *
   * `rangeKey` is commonly called a `sort key` in the AWS documentation.
   *
   * ```js
   * {
   * 	"id": String,
   * 	"email": {
   * 		"type": String,
   * 		"rangeKey": true
   * 	}
   * }
   * ```
   */
  rangeKey?: boolean;
  /**
   * This property can be used to use a different attribute name in your internal application as opposed to DynamoDB. This is especially useful if you have a single table design with properties like (`pk` & `sk`) which don't have much human readable meaning. You can use this to map those attribute names to better human readable names that better represent the underlying data. You can also use it for aliases such as mapping `id` to `userID`.
   *
   * When retrieving data from DynamoDB, the attribute will be renamed to this property name, or the first element of the array if it is an array. If you want to change this behavior look at the [`defaultMap`](#defaultmap-string) property.
   *
   * When saving to DynamoDB, the attribute name will always be used.
   *
   * ```js
   * "pk": {
   * 	"type": String,
   * 	"map": "userId"
   * }
   * "sk": {
   * 	"type": String,
   * 	"map": "orderId"
   * }
   * ```
   *
   * ```js
   * "id": {
   * 	"type": String,
   * 	"map": ["userID", "_id"]
   * }
   * ```
   */
  map?: string | string[];
  /**
   * This property can be used to use a different attribute name in your internal application as opposed to DynamoDB. This is especially useful if you have a single table design with properties like (`pk` & `sk`) which don't have much human readable meaning. You can use this to map those attribute names to better human readable names that better represent the underlying data. You can also use it for aliases such as mapping `id` to `userID`.
   *
   * When retrieving data from DynamoDB, the attribute will be renamed to this property name, or the first element of the array if it is an array. If you want to change this behavior look at the `defaultMap` property.
   *
   * When saving to DynamoDB, the attribute name will always be used.
   *
   * ```js
   * "pk": {
   * 	"type": String,
   * 	"alias": "userId"
   * }
   * "sk": {
   * 	"type": String,
   * 	"alias": "orderId"
   * }
   * ```
   *
   * ```js
   * "id": {
   * 	"type": String,
   * 	"alias": ["userID", "_id"]
   * }
   * ```
   */
  alias?: string | string[];
  /**
   * This property can be used to use a different attribute name in your internal application as opposed to DynamoDB. This is especially useful if you have a single table design with properties like (`pk` & `sk`) which don't have much human readable meaning. You can use this to map those attribute names to better human readable names that better represent the underlying data. You can also use it for aliases such as mapping `id` to `userID`.
   *
   * When retrieving data from DynamoDB, the attribute will be renamed to this property name, or the first element of the array if it is an array. If you want to change this behavior look at the `defaultMap` property.
   *
   * When saving to DynamoDB, the attribute name will always be used.
   *
   * ```js
   * "pk": {
   * 	"type": String,
   * 	"aliases": "userId"
   * }
   * "sk": {
   * 	"type": String,
   * 	"aliases": "orderId"
   * }
   * ```
   *
   * ```js
   * "id": {
   * 	"type": String,
   * 	"aliases": ["userID", "_id"]
   * }
   * ```
   */
  aliases?: string | string[];
  /**
   * This property can be set to change the default attribute to be renamed to when retrieving data from DynamoDB. This can either be an element from the [`map`](#map-string--string) array or the attribute name.
   *
   * By default the attribute name will be used if no `map` property is set. If a `map` property is set, it will use that (or the first element of the array if it is an array).
   *
   * ```js
   * "id": {
   * 	"type": String,
   * 	"map": "userID",
   * 	"defaultMap": "id"
   * }
   * ```
   */
  defaultMap?: string;
  /**
   * This property can be set to change the default attribute to be renamed to when retrieving data from DynamoDB. This can either be an element from the `map` array or the attribute name.
   *
   * By default the attribute name will be used if no `map` property is set. If a `map` property is set, it will use that (or the first element of the array if it is an array).
   *
   * ```js
   * "id": {
   * 	"type": String,
   * 	"map": "userID",
   * 	"defaultAlias": "id"
   * }
   * ```
   */
  defaultAlias?: string;
}

export interface SchemaSettings {
  timestamps?: boolean | TimestampObject;
  saveUnknown?: boolean | string[];
  set?: (value: ObjectType) => ObjectType;
  get?: (value: ObjectType) => ObjectType;
  validate?: (value: ObjectType) => boolean;
}

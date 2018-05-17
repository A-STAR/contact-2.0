import { Type } from '@angular/core';
import { setIn } from 'immutable';
import { pickExisting, serializeBoolParams } from '@app/core/utils';
import { compose } from 'ramda';

export enum FieldType {
  NONE,
  BOOLEAN,
  DATETIME,
  DATE,
}

export interface IFieldOptions {
  primaryKey: boolean;
  type: FieldType;
}

export const Field = (options: Partial<IFieldOptions> = {}) => (target: any, key: string) => {
  target.__ENTITY_METADATA__ = setIn(target.__ENTITY_METADATA__ || {}, [ 'options', key ], options);
  if (options.primaryKey) {
    target.__ENTITY_METADATA__ = setIn(target.__ENTITY_METADATA__ || {}, [ 'primaryKey' ], key);
  }
};

export const getPrimaryKey = (entityClass: Type<any>): string => {
  return entityClass.prototype.__ENTITY_METADATA__.primaryKey;
};

export const getOptions = (entityClass: Type<any>): Record<string, IFieldOptions> => {
  return entityClass.prototype.__ENTITY_METADATA__.options;
};

export const serializeKeys = (keys: string[]): string => {
  return keys.sort().join(',');
};

export const serializeParamsKeys = (params: Record<string, any>) => {
  return compose(serializeKeys, Object.keys, serializeBoolParams)(params);
};

export const serializeParams = (params: Record<string, any>): string => {
  return JSON.stringify(pickExisting(params));
};

import { Type } from '@angular/core';
import { compose } from 'ramda';
import { setIn } from 'immutable';

import { IEntityUrl } from './repository.interface';
import { pickExisting, pickExistingBy } from '@app/core/utils';

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
  return compose(serializeKeys, Object.keys, pickExisting)(params);
};

export const serializeParams = (params: Record<string, any>): string => {
  return JSON.stringify(pickExisting(params));
};

export const isSimpleUrl = (url: any): boolean => {
  return typeof url === 'string';
};

export const getUrl = (url: any): string => {
  return !isSimpleUrl(url) ? ( url as IEntityUrl ).url : url as string;
};

export const getUrlParams = (url: any): string[] => {
  return getUrl(url).match(/\{.+?\}/gi).map(i => i.slice(1, -1));
};

export const getQueryParams = (url: any, params: any): any => {
  return !isSimpleUrl(url) ? pickExistingBy((url as IEntityUrl).queryParams, params) : {};
};

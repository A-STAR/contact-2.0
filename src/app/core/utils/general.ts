/**
 * General purpose utility library
 * Description: exports small utility functions to be used across different components
 */

import { ActivatedRoute } from '@angular/router';
import { IOption, INamedValue } from '../converter/value-converter.interface';
import { ILookupLanguage } from '../lookup/lookup.interface';
import { IEntityTranslation, IEntitytTranslationValue } from '../entity/translations/entity-translations.interface';
import {
  is,
  pickBy,
  isNil,
  ifElse,
  identity,
  complement,
  pick,
} from 'ramda';

export const propOr = (prop: string, orValue: any) => obj => Object.hasOwnProperty.call(obj, prop) ? obj[prop] : orValue;

export const makeKey = (prefix: string) => (fieldName: string) => `${prefix}.${fieldName}`;

const addLabel = (key: string, prop: string) => {
  const labelKey = makeKey(key);
  return item => ({
    ...item,
    label: item.label || labelKey(item[prop])
  });
};
export const addFormLabel = (key: string) => addLabel(key, 'controlName');
export const addGridLabel = (key: string) => addLabel(key, 'prop');
export const addLabelForEntity = (entity: string) => addLabel(`common.entities.${entity}.fields`, 'name');

export const toLabeledValues = item => ({ label: item.name, value: item.code, isClosed: item.isClosed });

type IValueToOption<T> = (value: T) => IOption;

export const toOption = <T extends { [key: string]: any }>(valueKey: keyof T, labelKey: keyof T): IValueToOption<T> => {
  return value => ({
    label: value[labelKey],
    value: value[valueKey],
    isClosed: value.isClosed
  });
};

export const valuesToOptions = (values: Array<INamedValue>): Array<IOption> => {
  return (values || []).map(toOption<INamedValue>('id', 'name'));
};

export const toFullName = (person: { lastName: string, firstName: string, middleName: string }) => {
  return [ person.lastName, person.firstName, person.middleName ]
    .filter(Boolean).join(' ');
};

export const timeToHourMinSec = (str: string): { hour: number; minute: number; second: number; } => {
  // const validate = obj => {};
  const [ hour, minute, second ] = str.split(':').map(Number);
  return { hour, minute, second };
};

export const arrayToObject = (key: string) => (arr: Array<any>) => {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {});
};

export const checkboxRenderer = (key: string) => ({ [key]: truthy }) =>
  `<i class="fa fa${truthy ? '-check' : ''}-square-o" aria-hidden="true"></i>`;

export const yesNoRenderer = (key: string) => ({ [key]: truthy }) => truthy ? 'default.yesNo.Yes' : 'default.yesNo.No';

const reverseString = (str: string) => str.split('').reverse().join('');

export const phoneRenderer = (key: string) => ({ [key]: phone }) => (phone || '')
    .trim()
    .split('')
    .reverse()
    .join('')
    .replace(/^(\d{4})?(\d{1,3})?(\d{1,3})?(\d{1,3})?/, (_, p1, p2, p3, p4) => {
      const [t1, t2, t3, t4] = [p1, p2, p3, p4]
        .map(p => p || '')
        .map(reverseString)
        .reverse();
      return `${t1 ? '+' + t1 + ' ' : ''}${t2 ? '(' + t2 + ') ' : ''}${t3}-${t4}`;
  });

export const numberRenderer = (key: string) => ({ [key]: num }) => {
  const parts = (String(num == null ? 0 : num) || '').split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (!parts[1]) {
    parts.push('00');
  }
  return parts.join('.');
};

export const flatten = <T extends { children?: T[] }>(items: T[], key: keyof T = null) => {
  return items.reduce((acc, item) => [
    ...acc,
    key ? item[key] : item,
    ...(item.children ? flatten(item.children, key) : []),
  ], []);
};

export const flattenArray = (arr: any[]) => {
  return arr.reduce((acc, child) => acc.concat(Array.isArray(child) ? flattenArray(child) : child), []);
};

export const binaryFromArray = (arr: boolean[]) => {
  // tslint:disable-next-line:no-bitwise
  return arr.reduceRight<number>((acc, val, index) => acc |= Number(val) << (arr.length - index - 1), 0);
};

export const toBoolArray = (num: number) => {
  return Math.abs(num || 0).toString(2).split('').map(n => Boolean(+n));
};

export const toBoolSizedArray = (num: number, size: number = 1) => {
  const binaryArr = toBoolArray(num);
  size = size - binaryArr.length;
  while (size > 0) {
    binaryArr.unshift(false);
    size--;
  }
  return binaryArr;
};

export const invert = (a: boolean) => !a;

export const isEmpty = (array: any[]): boolean => !array || array.length === 0;

export const parseStringValueAttrs = (str: string) => (str || '')
  .split(/,\s?/g)
  .filter(Boolean)
  .map(s => parseInt(s, 10))
  .filter(n => n > 0 && n <= 10 )
  .map(attr => `stringValue${attr}`);

export const renderers = {
  checkboxRenderer,
  phoneRenderer,
  yesNoRenderer,
  numberRenderer,
};

export const round = (value: number, precision: number) => {
  const k = Math.pow(10, precision);
  return Math.round(k * value) / k;
};

export const floor = (value: number, precision: number) => {
  const k = Math.pow(10, precision);
  return Math.floor(k * value) / k;
};

export const range = (min: number, max: number): number[] => Array(max - min + 1).fill(null).map((_, i) => min + i);

export const random = (min: number, max: number): number => min + Math.round(Math.random() * (max - min));

/**
 * Allows to check is the current route matches the segment
 * i.e. `isRoute('create')`
 * @param route {ActivatedRoute}
 * @param segment {string}
 * @returns boolean
 */
export const isRoute = (route: ActivatedRoute, segment: string): boolean => {
  return route.snapshot.url.join('/').indexOf(segment) !== -1;
};

export function getTranslations(languages: ILookupLanguage[], translations: IEntityTranslation[]): IEntitytTranslationValue[] {

  function findTranslation(entityTranslations: IEntityTranslation[], languageId: number): string {
    const found = entityTranslations.find(t => t.languageId === languageId);
    return found ? found.value : null;
  }

  return languages.map(language =>
    ({
      label: language.name,
      languageId: language.id,
      isMain: language.isMain,
      value: findTranslation(translations, language.id)
    })
  );
}

export class IncId {
  private static _instance: IncId;
  private _uuid = 0;

  private constructor() {}

  static get(): IncId {
    return this._instance || (this._instance = new this());
  }

  is(id: number): boolean {
    return this._uuid === id;
  }

  set uuid(to: number) {
    this._uuid = Math.abs(to);
  }

  get uuid(): number {
    return ++this._uuid;
  }

}

export function deepFilterAndMap<T extends { children?: T[] }, V>(items: T[],
  filterKey: string | Function, mapKey: string | Function): V[] {
    const filterFn = item => (typeof filterKey === 'function' ? filterKey(item) : item[filterKey]);
    const mapFn = item => (typeof mapKey === 'function' ? mapKey(item) : item[mapKey]);
    return items.reduce((acc, item) => ([
      ...acc,
      ...(item.children && item.children.length ?
        deepFilterAndMap(item.children, filterKey, mapKey) : filterFn(item) ? [mapFn(item)] : []),
    ]), []);
}

export const isFalsy = v => isNil(v) || v === false;

export const pickExisting = ifElse(is(Object), pickBy(complement(isFalsy)), identity);

export const pickExistingBy = (by: string[], params: Record<string, any>) => {
  return pick(by, pickExisting(params));
};

export function pickDifference(filterObj: any, data: any): any {
  const filterKeys = Object.keys(filterObj);
  return pickBy((_, key: string) => !filterKeys.includes(key), data);
}

const isMergeableObject = (obj: any): boolean => {
  return obj && typeof obj === 'object' &&
    Object.prototype.toString.call(obj) !== '[object RegExp]' &&
    Object.prototype.toString.call(obj) !== '[object Date]';
};

const emptyTarget = (val: any) => {
  return Array.isArray(val) ? [] : {};
};

/**
 * Immutable clone
 * @param refFn Predicate which determines, should this value be passed by reference (without deep cloning)
 */
export const clone = (val: any, refFn?: (val: any) => boolean) => {
  const refPredicate = refFn || (() => false);
  return isMergeableObject(val) && !refPredicate(val) ? mergeDeep(emptyTarget(val), val) : val;
};

/**
 * Immutable merge arrays
 * @param refFn Predicate which determines, should this value be passed by reference (without deep cloning)
 */
export const mergeArray = (dst: any[], src: any[], refFn?: (val: any) => boolean): any[] => {
  const result = dst.slice();
  const refPredicate = refFn || (() => false);

  src.forEach((val, i) => {
    if (typeof result[i] === 'undefined') {
      result[i] = val;
    } else if (isMergeableObject(val)) {
      result[i] = mergeDeep(dst[i], val, refPredicate);
    } else if (dst.indexOf(val) === -1) {
      result.push(val);
    }
  });

  return result;
};
/**
 * Immutable merge objects
 * @param refFn Predicate which determines, should this value be passed by reference (without deep cloning)
 */
export const mergeObject = (dst: object, src: object, refFn?: (val: any) => boolean): object => {
  const result = {};
  const refPredicate = refFn || (() => false);

  if (isMergeableObject(dst)) {
    Object.keys(dst).forEach(key => {
      result[key] = clone(dst[key], refPredicate);
    });
  }

  if (isMergeableObject(src)) {
    Object.keys(src).forEach(key => {
      if (!isMergeableObject(src[key]) || !dst[key]) {
        result[key] = clone(src[key]);
      } else if (!refPredicate(src[key])) {
        result[key] = mergeDeep(dst[key], src[key], refPredicate);
      } else {
        result[key] = src[key];
      }
    });
  }

  return result;
};

/**
 * Immutable deep merge
 * @param refFn Predicate which determines, should this value be passed by reference (without deep cloning)
 */
export const mergeDeep = (dst: any, src: any, refFn?: (val: any) => boolean): any => {
  const isArray = Array.isArray(src);
  if (isArray) {
    return Array.isArray(dst) ? mergeArray(dst, src, refFn) : clone(src, refFn);
  }
  return mergeObject(dst, src, refFn);
};


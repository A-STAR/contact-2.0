/**
 * General purpose utility library
 * Description: exports small utility functions to be used across different components
 */

import { IOption, INamedValue } from '../converter/value-converter.interface';

export const propOr = (prop: string, orValue: any) => obj => Object.hasOwnProperty.call(obj, prop) ? obj[prop] : orValue;

export const makeKey = (prefix: string) => (fieldName: string) => `${prefix}.${fieldName}`;

export const toLabeledValues = item => ({ label: item.name, value: item.code });

type IValueToOption<T> = (value: T) => IOption;

export const toOption = <T extends Object>(valueKey: keyof T, labelKey: keyof T): IValueToOption<T> => {
  return value => ({
    label: value[labelKey],
    value: value[valueKey]
  });
};

export const valuesToOptions = (values: Array<INamedValue>): Array<IOption> => {
  return (values || []).map(toOption('id', 'name'));
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
    .replace(/^(\d{4})?(\d{1,3})?(\d{1,3})?(\d{1,3})?/, (str, p1, p2, p3, p4) => {
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

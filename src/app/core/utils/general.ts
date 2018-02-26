/**
 * General purpose utility library
 * Description: exports small utility functions to be used across different components
 */

import { ActivatedRoute } from '@angular/router';
import { IOption, INamedValue } from '../converter/value-converter.interface';
import { ILookupLanguage } from '../lookup/lookup.interface';
import { IEntityTranslation, IEntitytTranslationValue } from '../entity/translations/entity-translations.interface';

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

export const toLabeledValues = item => ({ label: item.name, value: item.code });

type IValueToOption<T> = (value: T) => IOption;

export const toOption = <T extends Object>(valueKey: keyof T, labelKey: keyof T): IValueToOption<T> => {
  return value => ({
    // TODO(i.lobanov): types are incompatible
    label: value[labelKey],
    value: value[valueKey]
  } as any);
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

export const flattenArray = (arr: any[]) => {
  return arr.reduce((acc, child) => acc.concat(Array.isArray(child) ? flattenArray(child) : child), []);
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

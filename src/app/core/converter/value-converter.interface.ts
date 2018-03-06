export type ValueType = string | number | boolean;

export interface IValueEntity {
  typeCode?: number;
  valueB?: number;
  valueD?: string;
  valueN?: number;
  valueS?: string;
  value?: ValueType;
}

/**
 * This one is mostly used in select controls
 * TODO: rename to IOption, while also considering to rename
 * `value` to `id`, which is more semantic
 */
export interface ILabeledValue {
  label?: string;
  value: any;
}

export interface INamedValue {
  id: number;
  name: string;
}

export interface IOption {
  label: string;
  value: number | string;
}

export interface IOptionSet {
  [key: number]: Array<IOption>;
}

export interface IDateFormats {
  date: string;
  dateTime: string;
  dateTimeWithoutSeconds: string;
  dateISO: string;
  time?: string;
  timeWithoutSeconds?: string;
}

export interface IDecimalFormats {
  minIntegerDigits: number;
  minFractionDigits: number;
  maxFractionDigits: number;
  /**
   * @see {@link https://github.com/angular/angular/tree/master/packages/common/locales|i18n locales}
   */
  locale?: string;
}

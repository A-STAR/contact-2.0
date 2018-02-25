export type ValueType = string | number | boolean;

export interface IValueEntity {
  typeCode?: number;
  valueB?: number;
  valueD?: string;
  valueN?: number;
  valueS?: string;
  value?: ValueType;
}

export interface ILabeledValue {
  value: any;
  label?: string;
  selected?: boolean;
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

export type ValueType = string | number | boolean;

export interface IValueEntity {
  typeCode?: number;
  valueB?: number | boolean;
  valueS?: string;
  valueN?: number;
  valueD?: string;
  value?: ValueType;
}

export interface ILabeledValue {
  value: any;
  label?: string;
  selected?: boolean;
  removed?: boolean;
  canRemove?: boolean;
  context?: any;
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
  time?: string;
}

export type ValueType = string | number | boolean;

export interface IValueEntity {
  typeCode?: number;
  valueB?: number | boolean;
  valueS?: string;
  valueN?: number;
  valueD?: Date;
  value?: ValueType;
}

export interface ILocalizedValue {
  trueValue?: string;
  falseValue?: string;
}

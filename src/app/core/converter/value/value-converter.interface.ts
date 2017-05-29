export type ValueType = string | number | boolean;

export interface IValueEntity {
  typeCode?: number;
  valueB?: number | boolean;
  valueS?: string;
  valueN?: number;
  valueD?: Date;
  value?: ValueType;
}

export interface ILabeledValue {
  value: any;
  label?: string;
  selected?: boolean;
  removed?: boolean;
  context?: any;
  isContextPresent?: boolean;
}

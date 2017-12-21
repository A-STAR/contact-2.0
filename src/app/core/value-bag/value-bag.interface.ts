export interface IValue {
  name: string;
  valueB: boolean;
  valueN: number;
  valueS: string;
}

export interface IValueBag {
  [key: string]: IValue;
}

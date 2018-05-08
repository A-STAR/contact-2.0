export interface ISegmentedInputValue {
  name: string;
  value: string;
}

export interface ISegmentedInputOption {
  name: string;
  label: string;
  mask?: ISegmentedInputMask;
}

export interface ISegmentedInputMask {
  delimeter?: string;
  maxNumbers?: number;
  maxNumberLength?: number;
}

import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';

export interface ITerm {
  id: number;
  code: number;
  name: string;
  typeCode: number|Array<ILabeledValue>;
  parentCode: number|Array<ILabeledValue>;
  parentCodeName: string;
  isClosed: number;
}

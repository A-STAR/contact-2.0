import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';

export interface IDict {
  id: number;
  code: number;
  name: string;
  translatedName: string;
  nameTranslations: Array<ILabeledValue>;
  parentCode: number|Array<ILabeledValue>;
  typeCode: number|Array<ILabeledValue>;
  termTypeCode: number|Array<ILabeledValue>;
}

import { Observable } from 'rxjs/Observable';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';

export interface IDataSource {
  create?: string;
  read?: string;
  update?: string;
  delete?: string;
  dataKey: string;
}

export interface IParameters {
  [index: string]: any;
}

export type TSelectionType = 'single' | 'multiClick' | 'multi' | undefined;

export interface IGridColumn {
  localized?: boolean;
  prop: string;
  name?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  disabled?: boolean;
  $$valueGetter?: Function;
}

export interface IRenderer {
  [key: string]: Function | Observable<ILabeledValue[]> | ILabeledValue[];
}

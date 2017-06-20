import {
  FilteringOperatorType,
  ILabeledValue
} from '../../../../../core/converter/value/value-converter.interface';

export interface IGrid2ColumnFilterData {
  firstValue: number|string|Date;
  secondValue: number|string|Date;
  firstSelectionValue: FilteringOperatorType|ILabeledValue[];
  secondSelectionValue: FilteringOperatorType|ILabeledValue[];
}

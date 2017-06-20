import { ILabeledValue } from '../../../../../core/converter/value/value-converter.interface';
import { FilteringOperatorType } from '../grid2-filter';

export interface IGrid2ColumnFilterData {
  firstValue: number|string|Date;
  secondValue: number|string|Date;
  firstSelectionValue: FilteringOperatorType|ILabeledValue[];
  secondSelectionValue: FilteringOperatorType|ILabeledValue[];
}

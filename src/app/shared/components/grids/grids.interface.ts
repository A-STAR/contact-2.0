/**
 * Base grid column interface for `ISimpleGridColumn` and others to extend
 *
 * T is type of row data
 */
export interface IGridColumn<T> {

  // Mandatory Fields
  label: string;
  prop: keyof T;

  // Optional Fields
  dictCode?: number;
}

export interface IGridTreeRow<T> {
  uniqueId: number;
  data: T;
  parentId?: number | string;
  children?: Array<IGridTreeRow<T>>;
  isExpanded?: boolean;
  sortOrder?: number;
}

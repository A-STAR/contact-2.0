export interface IAGridWrapperTreeColumn {
  colId?: string;
  name: string;
  label?: string;
  dataType: number;
  dictCode?: number;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  disabled?: boolean;
  editable?: boolean;
  hidden?: boolean;
  isDataPath?: boolean;
  renderer?: Function;
  valueGetter?: Function;
  valueFormatter?: Function;
}

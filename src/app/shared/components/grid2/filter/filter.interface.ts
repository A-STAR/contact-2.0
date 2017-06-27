export interface IFilterModel {
  value: any;
}

export interface IFilterInitParams {
  valueGetter: Function;
  filterChangedCallback: Function;
}

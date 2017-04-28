export interface IDataSource {
  create?: string;
  read?: string;
  update?: string;
  delete?: string;
  dataKey: string;
}

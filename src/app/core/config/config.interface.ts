export interface IConfig {
  api: {
    http: string;
    ws: string;
  };
  assets: string;
  domains: string[];
  i18n: string[];
}

export interface IConfig {
  api: {
    http: string;
    ws: string;
  };
  assets: string;
  domains: string[];
  i18n: string[];
  maps: {
    useProvider: keyof MapProviders;
    providers: MapProviders;
  };
  help: {
    url: string;
  };
}

interface MapProviders {
  google: {
    apiKey: string;
  };
  yandex: {
    apiKey: string;
  };
}

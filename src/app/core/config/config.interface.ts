export interface IConfig {
  api: {
    http: string;
    ws: string;
  };
  domains: string[];
  i18n: string[];
  maps: {
    useProvider: keyof MapProviders;
    providers: MapProviders;
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

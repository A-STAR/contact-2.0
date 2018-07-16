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
  customOperations: {
    [key: number]: {
      url: string;
    };
  };
  licenses: {
    agGrid: string;
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

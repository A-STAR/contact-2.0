import { IConfig } from '@app/core/config/config.interface';

export const load = (configUrl: string) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();

  request.onload = () => {
    if (request.status !== 200) {
      return reject(`Configuration error. Could not load config at ${configUrl}.`);
    }

    try {
      const response = JSON.parse(request.response);

      const domain = response.url.match(/:\/\/([^\/]+)/)[1];
      if (!domain) {
        return reject(`Configuration error. Could not extract whitelisted domains from config at ${configUrl}.`);
      }

      const assets = response.assets || '/assets';

      const config: IConfig = {
        api: {
          http: response.url,
          ws: response.ws,
        },
        assets,
        domains: [ domain ],
        i18n: (response.i18n || [ 'i18n/{lang}.json' ]).map(path => `${assets}/${path}`),
        maps: response.maps,
        help: response.help,
        customOperations: response.customOperations,
        licenses: response.licenses,
      };

      resolve(config);
    } catch (error) {
      return reject(`Configuration error. Could not parse config at ${configUrl}.`);
    }
  };

  request.open('GET', configUrl);
  request.send();
});

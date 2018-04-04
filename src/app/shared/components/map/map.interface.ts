import { Provider } from '@angular/core';

export interface IMapModuleOptions {
  mapServiceProvider?: Provider;
  config?: IMapConfig;
}

export interface IMapConfig {
  apiKey: string;
}

export interface IMapService {
  init(): void;
}

export enum MapProvider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
}

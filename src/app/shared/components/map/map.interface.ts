import { Provider } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LatLngLiteral } from 'leaflet';

export interface IMapModuleOptions {
  mapServiceProvider?: Provider;
  config?: IMapConfig;
}

export interface IMapConfig {
  apiKey: string;
}

export interface IMapService {
  init(mapConfig: IMapOptions): Observable<any>;
  createMarker(map: any, latlng: ILatLng, options?: any): any;
}

export interface IMapOptions {
  el: Element;
  zoom?: number;
  center?: { lat: number, lng: number };
}

export type ILatLng = LatLngLiteral | google.maps.LatLng;

export enum MapProvider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
}

import { Provider, ComponentRef } from '@angular/core';
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
  createMarker(map: any, markerDef: IMarker): ICreateMarkerResult;
}

export interface ICreateMarkerResult {
  marker: any;
  popupRef?: ComponentRef<any>;
}

export interface IMapOptions {
  el: Element;
  zoom?: number;
  center?: { lat: number, lng: number };
}

export interface IMarker {
  lat: number;
  lng: number;
  data?: any;
  popup?: any;
}

export type ILatLng = LatLngLiteral | google.maps.LatLng;

export enum MapProvider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
}

import { Provider, ComponentRef, Type } from '@angular/core';
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
  createMarker<T>(map: any, markerDef: IMarker<T>): ICreateMarkerResult<T>;
}

export interface ICreateMarkerResult<T> {
  marker: any;
  popupRef?: ComponentRef<T>;
}

export interface IMapOptions {
  el: Element;
  zoom?: number;
  center?: { lat: number, lng: number };
}

export interface IMarker<T> {
  lat: number;
  lng: number;
  data?: T;
  popup?: Type<{ data: T }>;
}

export type ILatLng = LatLngLiteral | google.maps.LatLng;

export enum MapProvider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
}

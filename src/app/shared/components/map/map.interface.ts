import { Provider, ComponentRef, Type, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LatLngLiteral, MapOptions } from 'leaflet';

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
  getIconConfig<T extends IIconConfigParam>(entity: T): IMarkerIconConfig;
  createBounds(latlngs?: any): any;
}

export interface IIconConfigParam {
  typeCode: number;
  isInactive: number | boolean;
}

export interface IMarkerIconConfig {
  char?: string;
  fillColor?: string;
  textColor?: string;
}

export interface ICreateMarkerResult<T> {
  marker: any;
  popupRef?: PopupComponentRefGetter<T>;
}

export type PopupComponentRefGetter<T> = () => ComponentRef<IMarker<T>>;

export interface IMapOptions extends MapOptions, google.maps.MapOptions {
  el?: Element;
  zoom?: number;
  center?: { lat: number, lng: number };
  fitToData?: boolean;
}

export interface IMarker<T> {
  lat: number;
  lng: number;
  iconConfig?: any;
  data?: T;
  popup?: Type<{ context: any }>;
  tpl?: TemplateRef<T>;
}

export type ILatLng = LatLngLiteral | google.maps.LatLng;

export enum MapProvider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
}

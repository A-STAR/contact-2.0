import { Provider, ComponentRef, Type, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LatLngLiteral, MapOptions, ControlPosition } from 'leaflet';

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
  createControl<T>(map: any, controlDef: IControlDef<T>): ControlComponentRefGetter<T>;
  getIconConfig<T extends IIconConfigParam>(configKey: string, entity: T): IMarkerIconConfig;
  createBounds(latlngs?: any): any;
}

export interface IControlDef<T> {
  map: any;
  position: ControlPosition | google.maps.ControlPosition;
  index: number;
  data?: T;
  cmp?: Type<IControlCmp<T>>;
  tpl?: TemplateRef<T>;
  hostClass?: string;
}

export interface IControlCmp<T> {
  context: {
    data?: T,
    index: number,
    map: any;
    position: ControlPosition | google.maps.ControlPosition;
  };
  tpl?: TemplateRef<T>;
}

export interface IPopupCmp<T> {
  context: {
    data?: T
  };
  tpl?: TemplateRef<T>;
}

export interface IMapComponents<T> {
  popups?: PopupComponentRefGetter<T>[];
  controls?: ControlComponentRefGetter<T>[];
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

export type PopupComponentRefGetter<T> = () => ComponentRef<IPopupCmp<T>>;
export type ControlComponentRefGetter<T> = () => ComponentRef<IControlCmp<T>>;

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
  popup?: Type<IPopupCmp<T>>;
  tpl?: TemplateRef<T>;
}

export type ILatLng = LatLngLiteral | google.maps.LatLng;

export enum MapProvider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
}

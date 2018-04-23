import { Provider, ComponentRef, Type, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  LatLngLiteral,
  MapOptions,
  ControlPosition,
  Marker,
  Map,
  LatLngBounds,
  LatLngBoundsLiteral,
} from 'leaflet';

export interface IMapModuleOptions {
  mapServiceProvider?: Provider;
  config?: IMapConfig;
}

export interface IMapConfig {
  apiKey: string;
}

export interface IMapService<T> {
  container: HTMLElement;
  getEntities(): IMapEntity<T>[];
  createBounds(latlngs?: LatLngBoundsLiteral | google.maps.LatLngLiteral[]): LatLngBounds | google.maps.LatLngBounds;
  createControl(controlDef: IControlDef<T>): ControlComponentRefGetter<T>;
  createMarker(markerDef: IMarker<T>): ICreateMarkerResult<T>;
  getControlPositionFromDef(position: MapControlPosition): google.maps.ControlPosition | ControlPosition;
  getIconConfig(configKey: string, entity: T): IMarkerIconConfig;
  getMap(): google.maps.Map | Map;
  addToMap(entity: IMapEntity<T>): void;
  removeFromMap(entity: IMapEntity<T>): void;
  init(mapConfig: IMapOptions): Observable<any>;
  removeMap(): void;
}

export interface IMapEntity<T> {
  marker: Marker | google.maps.Marker;
  data?: T;
}

export enum MapControlPosition {
   BOTTOM_CENTER,
   BOTTOM_LEFT,
   BOTTOM_RIGHT,
   LEFT_BOTTOM,
   LEFT_CENTER,
   LEFT_TOP,
   RIGHT_BOTTOM,
   RIGHT_CENTER,
   RIGHT_TOP,
   TOP_CENTER,
   TOP_LEFT,
   TOP_RIGHT
}

export interface IControlDef<T> {
  position: MapControlPosition;
  data?: T;
  cmp?: Type<IControlCmp<T>>;
  tpl?: TemplateRef<T>;
  hostClass?: string;
}

export interface IControlCmp<T> {
  context: IControlCmpContext<T>;
  tpl?: TemplateRef<T>;
}

export interface IComponentContext<T> {
  data?: T;
}

export interface IControlCmpContext<T> extends IComponentContext<T> {
  index: number;
  position: MapControlPosition;
  map: any;
}

export interface IPopupCmp<T> {
  context: IComponentContext<T>;
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
  entity: IMapEntity<T>;
  popupRef?: PopupComponentRefGetter<T>;
}

export type PopupComponentRefGetter<T> = () => ComponentRef<IPopupCmp<T>>;
export type ControlComponentRefGetter<T> = () => ComponentRef<IControlCmp<T>>;

export interface IMapOptions extends MapOptions, google.maps.MapOptions {
  el?: HTMLElement;
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

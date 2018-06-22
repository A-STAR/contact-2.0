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
  Polyline,
  Circle,
  Polygon,
  Rectangle,
  MarkerOptions,
  PolylineOptions,
  CircleMarkerOptions,
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
  createBounds(latlngs?: LatLngBoundsLiteral | google.maps.LatLngLiteral[]): LatLngBounds | google.maps.LatLngBounds;
  createControl(controlDef: IControlDef<T>): void;
  createLayer(layerDef: ILayerDef<T>): ILayer<T>;
  getControlPositionFromDef(position: MapControlPosition): google.maps.ControlPosition | ControlPosition;
  getIconConfig(configKey: string, data?: T, params?: any): ILayerIconConfig;
  getMap(): google.maps.Map | Map;
  addToMap(layer: ILayer<T>): void;
  removeFromMap(layer: ILayer<T>): void;
  init(mapConfig: IMapOptions): Observable<any>;
  removeMap(): void;
  setIcon?(layer: ILayer<T>, configKey: string, params?: any): void;
}

export enum LayerType {
  MARKER,
  POLYLINE,
  CIRCLE,
  POLYGON,
  RECTANGLE,
}

export interface ILayerDef<T> {
  latlngs: Geo;
  type: LayerType;
  options?: GeoLayerOptions;
  iconConfig?: any;
  data?: T;
  radius?: number;
  popup?: Type<IPopupCmp<T>>;
  tpl?: TemplateRef<T>;
}

export type GeoPoint = google.maps.LatLngLiteral | LatLngLiteral;

export type GeoCircle = GeoPoint & { radius: number };

export type GeoLine = GeoPoint[];

export type GeoPolygon = GeoPoint[] | GeoPoint[][];

export type Geo = GeoPoint | GeoCircle | GeoLine | GeoPolygon;

export type GoogleLayerOptions =  google.maps.MarkerOptions |
                                  google.maps.CircleOptions |
                                  google.maps.PolylineOptions |
                                  google.maps.PolygonOptions;

export type LeafletLayerOptions = MarkerOptions |
                                  CircleMarkerOptions |
                                  PolylineOptions;

export type GeoLayerOptions = GoogleLayerOptions | LeafletLayerOptions;

export type GoogleGeoLayer =  google.maps.Marker |
                              google.maps.Polyline |
                              google.maps.Circle |
                              google.maps.Polygon |
                              google.maps.Rectangle;

export type LeafletGeoLayer = Marker |
                              Polyline |
                              Circle |
                              Polygon |
                              Rectangle;

export type GeoLayer = GoogleGeoLayer | LeafletGeoLayer;

export interface ILayer<T> {
  nativeLayer: GeoLayer;
  id?: number;
  type: LayerType;
  isGroup?: boolean;
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
  position: MapControlPosition;
  map: any;
  index?: number;
}

export interface IPopupCmp<T> {
  context: IComponentContext<T>;
  tpl?: TemplateRef<T>;
}

export type MapComponents<T>  = Array<ControlComponentRefGetter<T> | PopupComponentRefGetter<T>>;

export interface IIconConfigParam {
  typeCode: number;
  isInactive: number | boolean;
}

export interface ILayerIconConfig {
  char?: string;
  fillColor?: string;
  textColor?: string;
  fontSize?: number;
}

export type PopupComponentRefGetter<T> = () => ComponentRef<IPopupCmp<T>>;
export type ControlComponentRefGetter<T> = () => ComponentRef<IControlCmp<T>>;

export interface IMapOptions extends MapOptions, google.maps.MapOptions {
  el?: HTMLElement;
  zoom?: number;
  center?: { lat: number, lng: number };
  fitToData?: boolean;
}

export enum MapProvider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
}

import { Injectable, ComponentRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {} from '@types/googlemaps';

import {
  IMapOptions,
  ILayer,
  PopupComponentRefGetter,
  ILayerIconConfig,
  IControlDef,
  IControlCmp,
  IPopupCmp,
  MapControlPosition,
  IMapService,
  LayerType,
  ILayerDef,
  GeoPoint,
  GeoLine,
  GoogleGeoLayer,
} from '../../map-providers.interface';
import { Libraries } from './maps-google.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapRendererService } from '../../renderer/map-renderer.service';

import { IncId } from '@app/core/utils';
import { MapProvider } from '@app/core/map-providers/providers/map-provider';

import { getLatLngDistance } from '../../utils/map-utils';

@Injectable()
export class MapGoogleService<T> extends MapProvider<T> implements IMapService<T> {
  readonly apiKey = this.configService.config.maps.providers.google.apiKey;

  private static ICON_CONFIGS = {
    singleAddress: [
      // NOTE: colors without hash
      // Inactive color, char determined by typeCode
      { fillColor: 'dde6e9', textColor: '131e26' }, // Gray fill, black textColor
      { fillColor: '37bc9b', char: 'R', textColor: 'ffffff' }, // Green fill, white textColor
      { fillColor: 'fa8080', char: 'A', textColor: 'ffffff' }, // Red fill, white textColor
      { fillColor: '23b7e5', char: 'W', textColor: 'ffffff' }, // Blue fill, white textColor
      { fillColor: 'fad732', char: 'E', textColor: '3a3f51' }, // Yellow fill, dark gray textColor
    ],
    addressByPerson: [
      // NOTE: colors without hash
      // Inactive color, char determined by typeCode
      { fillColor: 'dde6e9', textColor: '131e26' }, // Gray fill, black textColor
      { fillColor: '37bc9b', char: 'R', textColor: 'ffffff' }, // Green fill, white textColor
      { fillColor: 'fa8080', char: 'A', textColor: 'ffffff' }, // Red fill, white textColor
      { fillColor: '23b7e5', char: 'W', textColor: 'ffffff' }, // Blue fill, white textColor
      { fillColor: 'fad732', char: 'E', textColor: '3a3f51' }, // Yellow fill, dark gray textColor
    ],
    addressByContact: [
      // TODO(i.lobanov): implement logic
      // NOTE: colors without hash
      // Inactive color, char determined by typeCode
      { fillColor: 'dde6e9', textColor: '131e26' }, // Gray fill, black textColor
      { fillColor: '37bc9b', char: 'CR', fontSize: 10, textColor: 'ffffff' }, // Green fill, white textColor
      { fillColor: 'fa8080', char: 'CA', fontSize: 10, textColor: 'ffffff' }, // Red fill, white textColor
      { fillColor: '23b7e5', char: 'CW', fontSize: 10, textColor: 'ffffff' }, // Blue fill, white textColor
      { fillColor: 'fad732', char: 'CE', fontSize: 10, textColor: '3a3f51' }, // Yellow fill, dark gray textColor
    ],
    addressByContactLine: [
      { fillColor: '23b7e5' }
    ]
  };

  static ICON_CONFIG_GETTERS = {
    singleAddress: (config: ILayerIconConfig[], entity?: any) => {
      if (entity) {
        const result = {
          ...config[entity.typeCode]
        };
        return entity.isInactive ? { ...result, ...config[0] } : result;
      }
      return {
        ...config[0]
      };
    },
    addressByPerson: (config: ILayerIconConfig[], entity?: any) => {
      if (entity) {
        const result = {
          ...config[entity.typeCode]
        };
        return entity.isInactive ? { ...result, ...config[0] } : result;
      }
      return {
        ...config[0]
      };
    },
    addressByContact: (config: ILayerIconConfig[], data?: any, params?: number) => {
      if (data && data.addressLatitude && data.addressLongitude) {
        const result = { ...config[data.addressTypeCode] };
        if (data.distance) {
          result.fillColor = data.distance <= params ? '37bc9b' : 'fad732';
        } else {
          result.fillColor = '23b7e5';
        }
        return result;
      }
      return {
        ...config[config.length - 1],
        char: 'C'
      };
    }
  };

  private libraryEl: HTMLScriptElement;
  private dynamicIconBaseUrl = 'https://chart.googleapis.com/chart?';
  private _map: google.maps.Map;
  private _listeners: any[] = [];

  container: HTMLElement;

  constructor(
    private configService: ConfigService,
    private mapRendererService: MapRendererService,
    private zone: NgZone,
  ) {
    super();
  }

  init(mapConfig: IMapOptions): Observable<any> {
    return Observable.create(observer =>
      this.load(
        _ => {
          observer.next(this.initMap(mapConfig));
          observer.complete();
        },
        e => {
          observer.error(`Couldn't load google-maps library:\n ${e}`);
          observer.complete();
        },
      ),
    );
  }

  createLayer(data: ILayerDef<T>): ILayer<T> {
    switch (data.type) {
      case LayerType.MARKER:
        return this.createMarker(data);
      case LayerType.POLYLINE:
        return this.createPolyline(data);
      case LayerType.CIRCLE:
        return this.createCircle(data);
      case LayerType.POLYGON:
      case LayerType.RECTANGLE:
        return this.createPolygon(data);
      default:
        throw new Error(`Unknown layer type: ${data.type}`);
    }
  }

  createMarker(data: ILayerDef<T>,
  ): ILayer<T> {
    let popupRef;
    const marker = new google.maps.Marker({
      ...data.options as google.maps.MarkerOptions,
      position: data.latlngs as GeoPoint,
      map: this._map,
      icon: data.iconConfig
        ? this.createMarkerIcon(data.iconConfig)
        : undefined,
    });
    if (data.popup) {
      popupRef = this.createPopup(this._map, marker, data);
    }

    if (popupRef) {
      this.addComponent(popupRef);
    }

    return { nativeLayer: marker, data: data.data, type: data.type };
  }

  setIcon(layer: ILayer<T>, configKey: string, params?: any): void {
    if (layer.type === LayerType.MARKER) {
      const iconConfig = this.getIconConfig(configKey, layer.data, params);
      const oldIcon = (layer.nativeLayer as google.maps.Marker).getIcon();
      const newIcon = this.createMarkerIcon(iconConfig);
      if (oldIcon !== newIcon) {
        (layer.nativeLayer as google.maps.Marker).setIcon(newIcon);
      }
    }
  }

  createControl(controlDef: IControlDef<T>): void {
    const { compRef, el } = this.mapRendererService.render<IControlCmp<T>>(
      controlDef.cmp,
      controlDef.data,
    );
    const inc = IncId.get();
    const index = inc.uuid;

    (el as any).index = index;

    if (controlDef.hostClass) {
      el.classList.add(controlDef.hostClass);
    }

    compRef.instance.context = {
      ...compRef.instance.context,
      map: this._map,
      index,
      position: controlDef.position,
    };

    this._map.controls[this.getControlPositionFromDef(controlDef.position)].push(el);
    // to prevent `Expression has changed after it was checked` error
    compRef.changeDetectorRef.detectChanges();

    this.addComponent(() => compRef);
  }

  removeControl(position: any, index: number): void {
    position.removeAt(index);
  }

  removeControls(): void {
    if (this._map.controls && this._map.controls.length) {
      this._map.controls.forEach(position => {
        position.clear();
      });
    }
  }

  createMarkerIcon(config: ILayerIconConfig): string {
    // tslint:disable-next-line:max-line-length
    return `${this.dynamicIconBaseUrl}chst=d_map_spin&chld=${[0.75, 0, config.fillColor, config.fontSize || 12, '_', config.char].join('%7C')}`;
  }

  getIconConfig(configKey: string, entity?: T, params?: any): ILayerIconConfig {
    if (MapGoogleService.ICON_CONFIGS[configKey]) {
      return MapGoogleService.ICON_CONFIG_GETTERS[configKey] ?
        MapGoogleService.ICON_CONFIG_GETTERS[configKey](MapGoogleService.ICON_CONFIGS[configKey], entity, params)
          // no config getter found, return first config entry
          : MapGoogleService.ICON_CONFIGS[configKey][0];
    } else {
      throw new Error(`No icon config for <${configKey}> was found!`);
    }
  }

  createPolyline(data: ILayerDef<T>): ILayer<T> {
    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      strokeColor: (data.options as google.maps.PolylineOptions).strokeColor,
      scale: 4
    };
    const polyline = new google.maps.Polyline({
      strokeOpacity: 0,
      path: data.latlngs as GeoLine,
      map: this._map,
      icons: [
        {
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }
      ],
    });
    const popup = new google.maps.InfoWindow({
      content: ''
    });
    this._listeners.push(
      polyline.addListener('mouseover', _ => {
        popup.setPosition( this.getPolylineMiddlePoint(polyline));
        const path = polyline.getPath().getArray();
        const distance = getLatLngDistance(
          { lat: path[0].lat(), lng: path[0].lng() },
          { lat: path[1].lat(), lng: path[1].lng() }
        );
        popup.setContent(`${distance.toFixed(2)} m`);
        popup.open(this._map);
      }),
      polyline.addListener('mouseout', _ => {
        popup.close();
      })
    );
    return { nativeLayer: polyline, data: data.data, type: data.type };
  }

  createCircle(data: ILayerDef<T>): ILayer<T> {
    const circle = new google.maps.Circle({
      ...data.options as google.maps.CircleOptions,
      map: this._map,
      center: data.latlngs as GeoPoint,
      radius: data.radius || 10
    });
    return { nativeLayer: circle, type: data.type, data: data.data };
  }

  createPolygon(_: ILayerDef<T>): ILayer<T> {
    throw new Error('Not implemented');
  }

  createBounds(
    latlngs?: google.maps.LatLngLiteral[],
  ): google.maps.LatLngBounds {
    return new google.maps.LatLngBounds(...(latlngs || []));
  }

  removeMap(): void {
    this.removeControls();
    this.removeComponents();
    this.removeListeners();
  }

  getControlPositionFromDef(
    position: MapControlPosition,
  ): google.maps.ControlPosition {
    switch (position) {
      case MapControlPosition.BOTTOM_CENTER:
        return google.maps.ControlPosition.BOTTOM_CENTER;
      case MapControlPosition.BOTTOM_LEFT:
        return google.maps.ControlPosition.BOTTOM_LEFT;
      case MapControlPosition.BOTTOM_RIGHT:
        return google.maps.ControlPosition.BOTTOM_RIGHT;
      case MapControlPosition.LEFT_BOTTOM:
        return google.maps.ControlPosition.LEFT_BOTTOM;
      case MapControlPosition.LEFT_CENTER:
        return google.maps.ControlPosition.LEFT_CENTER;
      case MapControlPosition.LEFT_TOP:
        return google.maps.ControlPosition.LEFT_TOP;
      case MapControlPosition.TOP_LEFT:
        return google.maps.ControlPosition.TOP_LEFT;
      case MapControlPosition.TOP_CENTER:
        return google.maps.ControlPosition.TOP_CENTER;
      case MapControlPosition.TOP_RIGHT:
        return google.maps.ControlPosition.TOP_RIGHT;
      case MapControlPosition.RIGHT_BOTTOM:
        return google.maps.ControlPosition.RIGHT_BOTTOM;
      case MapControlPosition.RIGHT_CENTER:
        return google.maps.ControlPosition.RIGHT_CENTER;
      case MapControlPosition.RIGHT_TOP:
        return google.maps.ControlPosition.RIGHT_TOP;
      default:
        return google.maps.ControlPosition.BOTTOM_RIGHT;
    }
  }

  getMap(): google.maps.Map {
    return this._map;
  }

  removeFromMap(layer: ILayer<T>): void {
    if (layer && layer.nativeLayer) {
      (layer.nativeLayer as google.maps.Marker).setMap(null);
    }
  }

  addToMap(layer: ILayer<T>): void {
    if (layer && layer.nativeLayer && !(layer.nativeLayer as GoogleGeoLayer).getMap()) {
      (layer.nativeLayer as google.maps.Marker).setMap(this._map);
    }
  }

  private getPolylineMiddlePoint(poly: google.maps.Polyline): google.maps.LatLng {
    const [ startLatLng, endLatLng ] = poly.getPath().getArray();
    const projection = this._map.getProjection();
    const startPoint = projection.fromLatLngToPoint(startLatLng);
    const endPoint = projection.fromLatLngToPoint(endLatLng);
    const midPoint = new google.maps.Point(
      (startPoint.x + endPoint.x) / 2,
      (startPoint.y + endPoint.y) / 2
    );
    return projection.fromPointToLatLng(midPoint);
  }

  private removeListeners(): void {
    this._listeners.forEach(l => google.maps.event.removeListener(l));
  }

  private createPopup(
    map: google.maps.Map,
    marker: google.maps.Marker,
    layerDef: ILayerDef<T>,
  ): PopupComponentRefGetter<T> {
    let el: HTMLElement, compRef: ComponentRef<IPopupCmp<T>>;
    const popup = new google.maps.InfoWindow();
    this._listeners.push(
      marker.addListener('click', () => {
        this.zone.run(() => {
          if (compRef) {
            compRef.destroy();
          }
          const result = this.mapRendererService.render<IPopupCmp<T>>(
            layerDef.popup,
            layerDef.data,
            layerDef.tpl,
          );
          el = result.el;
          // prevent google InfoGroup scrolls
          el.style.overflow = 'hidden';
          compRef = result.compRef;
          popup.setContent(el);
          popup.open(map, marker);
          compRef.changeDetectorRef.detectChanges();
        });
      }),
    );
    this._listeners.push(
      popup.addListener('closeclick', _ => {
        if (compRef) {
          compRef.destroy();
        }
      }),
    );
    return () => compRef;
  }

  private load(
    onLoad: EventListener,
    onError: EventListener,
    libraries: Libraries[] = ['drawing', 'geometry'],
  ): void {
    if (!this.libraryEl) {
      this.unload(onLoad, onError);
      this.libraryEl = document.createElement('script');
      this.libraryEl.id = 'google-maps-library';
      this.libraryEl.src = `https://maps.googleapis.com/maps/api/js?key=${
        this.apiKey
      }&libraries=${libraries.join()}`;
      this.libraryEl.addEventListener('load', onLoad);
      this.libraryEl.addEventListener('error', onError);
      document.body.appendChild(this.libraryEl);
    } else {
      onLoad(null);
    }
  }

  private unload(onLoad: EventListener, onError: EventListener): void {
    const libraryEl = document.body.querySelector('#google-maps-library');
    if (libraryEl) {
      libraryEl.removeEventListener('load', onLoad);
      libraryEl.removeEventListener('error', onError);
      libraryEl.parentElement.removeChild(libraryEl);
    }
  }

  private initMap(config: IMapOptions): any {
    const { el, ...options } = config;
    this.container = el;
    if (this._map) {
      const mapDiv = this._map.getDiv();
      el.appendChild(mapDiv);
      google.maps.event.trigger(this._map, 'resize');
      this._map.setOptions(options);
      return this._map;
    }
    return (this._map = new google.maps.Map(el, options));
  }
}

import { Injectable, ComponentRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {} from '@types/googlemaps';

import {
  IMapOptions,
  IMarker,
  ICreateMarkerResult,
  PopupComponentRefGetter,
  IMarkerIconConfig,
  IControlDef,
  ControlComponentRefGetter,
  IControlCmp,
  IPopupCmp,
  MapControlPosition,
  IMapEntity,
  IMapService,
} from '../../map-providers.interface';
import { Libraries } from './maps-google.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapRendererService } from '../../renderer/map-renderer.service';

import { IncId } from '@app/core/utils';

@Injectable()
export class MapGoogleService<T> implements IMapService<T> {
  readonly apiKey = this.configService.config.maps.providers.google.apiKey;

  private static ICON_CONFIGS = {
    singleAddress: [
      // NOTE: colors without hash
      // Inactive color, char determined by typeCode
      { fillColor: 'dde6e9', textColor: '131e26' }, // Gray fill, black textColor
      { fillColor: '37bc9b', char: 'R', textColor: 'd8d5e2' }, // Green fill, white textColor
      { fillColor: 'fa8080', char: 'A', textColor: 'd8d5e2' }, // Red fill, white textColor
      { fillColor: '23b7e5', char: 'W', textColor: 'd8d5e2' }, // Blue fill, white textColor
      { fillColor: 'fad732', char: 'E', textColor: '3a3f51' }, // Yellow fill, dark gray textColor
    ],
    addressByPerson: [
      // NOTE: colors without hash
      // Inactive color, char determined by typeCode
      { fillColor: 'dde6e9', textColor: '131e26' }, // Gray fill, black textColor
      { fillColor: '37bc9b', char: 'R', textColor: 'd8d5e2' }, // Green fill, white textColor
      { fillColor: 'fa8080', char: 'A', textColor: 'd8d5e2' }, // Red fill, white textColor
      { fillColor: '23b7e5', char: 'W', textColor: 'd8d5e2' }, // Blue fill, white textColor
      { fillColor: 'fad732', char: 'E', textColor: '3a3f51' }, // Yellow fill, dark gray textColor
    ],
    addressByContact: [
      // TODO(i.lobanov): implement logic
      // NOTE: colors without hash
      // Inactive color, char determined by typeCode
      { fillColor: 'dde6e9', textColor: '131e26' }, // Gray fill, black textColor
      { fillColor: '37bc9b', char: 'R', textColor: 'd8d5e2' }, // Green fill, white textColor
      { fillColor: 'fa8080', char: 'A', textColor: 'd8d5e2' }, // Red fill, white textColor
      { fillColor: '23b7e5', char: 'W', textColor: 'd8d5e2' }, // Blue fill, white textColor
      { fillColor: 'fad732', char: 'E', textColor: '3a3f51' }, // Yellow fill, dark gray textColor
    ],
  };

  private libraryEl: HTMLScriptElement;
  private dynamicIconBaseUrl = 'https://chart.googleapis.com/chart?';
  private _map: google.maps.Map;
  private _entities: IMapEntity<T>[] = [];
  private _listeners: any[] = [];

  container: HTMLElement;

  constructor(
    private configService: ConfigService,
    private mapRendererService: MapRendererService,
    private zone: NgZone,
  ) {}

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

  createMarker(markerDef: IMarker<T>,
  ): ICreateMarkerResult<T> {
    let popupRef;
    const marker = new google.maps.Marker({
      position: { lat: markerDef.lat, lng: markerDef.lng },
      map: this._map,
      icon: markerDef.iconConfig
        ? this.createMarkerIcon(markerDef.iconConfig)
        : undefined,
    });
    if (markerDef.popup) {
      popupRef = this.createPopup(this._map, marker, markerDef);
    }
    const entity = { marker, data: markerDef.data };
    this._entities.push(entity);

    return { entity, popupRef };
  }

  createControl(controlDef: IControlDef<T>): ControlComponentRefGetter<T> {
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

    return () => compRef;
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

  getEntities(): IMapEntity<T>[] {
    return this._entities;
  }

  createMarkerIcon(config: IMarkerIconConfig): string {
    return `${this.dynamicIconBaseUrl}chst=d_map_pin_letter&chld=${
      config.char
    }%7C${config.fillColor}%7C${config.textColor}`;
  }

  getIconConfig(
    configKey: string,
    entity: T,
    typeProp: string = 'typeCode',
    inactiveProp: string = 'isInactive',
  ): IMarkerIconConfig {
    if (MapGoogleService.ICON_CONFIGS[configKey]) {
      return entity[inactiveProp]
        ? {
            ...MapGoogleService.ICON_CONFIGS[configKey][entity[typeProp]],
            ...MapGoogleService.ICON_CONFIGS[configKey][0],
          }
        : {
            ...MapGoogleService.ICON_CONFIGS[configKey][entity[typeProp]],
          };
    } else {
      throw new Error(`No icon config for <${configKey}> was found!`);
    }
  }

  createBounds(
    latlngs?: google.maps.LatLngLiteral[],
  ): google.maps.LatLngBounds {
    return new google.maps.LatLngBounds(...(latlngs || []));
  }

  removeMap(): void {
    this.removeControls();
    this.removeMarkers();
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

  removeFromMap(entity: IMapEntity<T>): void {
    if (entity && entity.marker) {
      (entity.marker as google.maps.Marker).setMap(null);
    }
  }

  addToMap(entity: IMapEntity<T>): void {
    if (entity && entity.marker && !(entity.marker as google.maps.Marker).getMap()) {
      (entity.marker as google.maps.Marker).setMap(this._map);
    }
  }

  private removeMarkers(): void {
    this._entities.forEach(entity => (entity.marker as google.maps.Marker).setMap(null));
    this._entities = [];
  }

  private removeListeners(): void {
    this._listeners.forEach(l => google.maps.event.removeListener(l));
  }

  private createPopup(
    map: google.maps.Map,
    marker: google.maps.Marker,
    markerDef: IMarker<T>,
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
            markerDef.popup,
            markerDef.data,
            markerDef.tpl,
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
    libraries: Libraries[] = ['drawing'],
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

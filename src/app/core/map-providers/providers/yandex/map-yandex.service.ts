import { Injectable, ComponentRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  Map,
  TileLayer,
  Marker,
  Icon,
  Popup,
  LeafletEvent,
  LatLngBounds,
  LatLngBoundsLiteral,
  ControlPosition,
} from 'leaflet';

import {
  IMapOptions,
  ICreateMarkerResult,
  IMarker,
  PopupComponentRefGetter,
  IMarkerIconConfig,
  IPopupCmp,
  MapControlPosition,
  IMapEntity,
  IMapService,
} from '../../map-providers.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapRendererService } from '../../renderer/map-renderer.service';

@Injectable()
export class MapYandexService<T> implements IMapService<T> {

  private static OSM_URL = `http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;

  readonly apiKey = this.configService.config.maps.providers.yandex.apiKey;

  container: HTMLElement;
  private _map: Map;
  private _entities: IMapEntity<T>[] = [];

  constructor(
    private configService: ConfigService,
    private mapRendererService: MapRendererService,
    private zone: NgZone,
  ) {
    // override Leaflet default icon path
    Icon.Default.imagePath = 'assets/img/';
  }

  init(mapConfig: IMapOptions): Observable<any> {
    const { el, ...config } = mapConfig;
    this.container = el;
    return of(this.initMap(new Map(el as HTMLElement, config)));
  }

  initMap(map: Map): Map {
    const osm = new TileLayer(MapYandexService.OSM_URL, {
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
    });
    map.addLayer(osm);
    this._map = map;
    return map;
  }

  createMarker(markerDef: IMarker<T>): ICreateMarkerResult<T> {
    let popupRef;
    const marker = new Marker({ lat: markerDef.lat, lng: markerDef.lng });
    if (markerDef.popup) {
      popupRef = this.createPopup(this._map, marker, markerDef);
    }
    this._map.addLayer(marker);
    const entity = { marker, data: markerDef.data };
    this._entities.push(entity);
    return { entity, popupRef };
  }

  createControl(): any {
    // TODO(i.lobanov): implement;
    return _ => ({} as T);
  }

  createPolyline(): any {
    // TODO(i.lobanov): implement;
    return {};
  }

  getIconConfig(): IMarkerIconConfig {
    // TODO(i.lobanov): implement;
    return {};
  }

  getMap(): Map {
    return this._map;
  }

  removeMap(): void {
    // TODO(i.lobanov): implement
    this._entities = [];
  }

  addToMap(entity: IMapEntity<T>): void {
    if (entity && entity.marker && !this._map.hasLayer((entity.marker as Marker))) {
      (entity.marker as Marker).addTo(this._map);
    }
  }

  removeFromMap(entity: IMapEntity<T>): void {
    if (entity && entity.marker && this._map.hasLayer((entity.marker as Marker))) {
      (entity.marker as Marker).removeFrom(this._map);
    }
  }

  createBounds(latlngs: LatLngBoundsLiteral): LatLngBounds {
    return new LatLngBounds(latlngs);
  }

  getEntities(): IMapEntity<T>[] {
    return this._entities;
  }

  getControlPositionFromDef(position: MapControlPosition): ControlPosition {
    switch (position) {
      case MapControlPosition.BOTTOM_RIGHT:
      case MapControlPosition.BOTTOM_CENTER:
      case MapControlPosition.RIGHT_BOTTOM:
      case MapControlPosition.RIGHT_CENTER:
        return 'bottomright';
      case MapControlPosition.BOTTOM_LEFT:
      case MapControlPosition.LEFT_BOTTOM:
      case MapControlPosition.LEFT_CENTER:
        return 'bottomleft';
      case MapControlPosition.LEFT_TOP:
      case MapControlPosition.TOP_LEFT:
        return 'topleft';
      case MapControlPosition.TOP_CENTER:
      case MapControlPosition.TOP_RIGHT:
      case MapControlPosition.RIGHT_TOP:
        return 'topright';
      default:
        return 'bottomright';
    }
  }

  private createPopup(map: Map, marker: Marker, markerDef: IMarker<T>): PopupComponentRefGetter<T> {
    let el: HTMLElement, compRef: ComponentRef<IPopupCmp<T>>;
    const popup = new Popup({ closeButton: false }, marker);
    marker.on('click', (e: LeafletEvent) => {
      this.zone.run(() => {
        if (compRef) {
          compRef.destroy();
        }
        const result = this.mapRendererService.render<IPopupCmp<T>>(markerDef.popup, markerDef.data);
        el = result.el;
        compRef = result.compRef;
        popup.setContent(el);
        popup.setLatLng((e.target as Marker).getLatLng());
        map.openPopup(popup);
        compRef.changeDetectorRef.detectChanges();
      });
    });

    marker.on('popupclose', _ => {
      if (compRef) {
        compRef.destroy();
      }
    });
    return () => compRef;
  }

}

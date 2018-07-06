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
  LatLngExpression,
  MarkerOptions,
} from 'leaflet';

import {
  IMapOptions,
  PopupComponentRefGetter,
  ILayerIconConfig,
  IPopupCmp,
  MapControlPosition,
  ILayer,
  IMapService,
  ILayerDef,
  LayerType,
  LeafletGeoLayer,
} from '../../map-providers.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapRendererService } from '../../renderer/map-renderer.service';
import { MapProvider } from '@app/core/map-providers/providers/map-provider';

@Injectable()
export class MapYandexService<T> extends MapProvider<T> implements IMapService<T> {

  private static OSM_URL = `http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;

  readonly apiKey = this.configService.config.maps.providers.yandex.apiKey;

  container: HTMLElement;
  private _map: Map;

  constructor(
    private configService: ConfigService,
    private mapRendererService: MapRendererService,
    private zone: NgZone,
  ) {
    super();
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

  createMarker(data: ILayerDef<T>): ILayer<T> {
    let popupRef;
    const marker = new Marker(data.latlngs as LatLngExpression, data.options as MarkerOptions);
    if (data.popup) {
      popupRef = this.createPopup(this._map, marker, data);
    }
    this._map.addLayer(marker);
    if (popupRef) {
      this.addComponent(popupRef);
    }
    return { nativeLayer: marker, data: data.data, type: data.type };
  }

  createPolyline(_: ILayerDef<T>): ILayer<T> {
    throw new Error('Not implemented!');
  }

  createCircle(_: ILayerDef<T>): ILayer<T> {
    throw new Error('Not implemented!');
  }

  createPolygon(_: ILayerDef<T>): ILayer<T> {
    throw new Error('Not implemented!');
  }

  createControl(): any {
    throw new Error('Not implemented!');
  }

  getIconConfig(): ILayerIconConfig {
    throw new Error('Not implemented!');
  }

  getMap(): Map {
    return this._map;
  }

  addToMap(layer: ILayer<T>): void {
    if (layer && layer.nativeLayer && !this._map.hasLayer((layer.nativeLayer as LeafletGeoLayer))) {
      (layer.nativeLayer as LeafletGeoLayer).addTo(this._map);
    }
  }

  removeFromMap(layer: ILayer<T>): void {
    if (layer && layer.nativeLayer && this._map.hasLayer((layer.nativeLayer as LeafletGeoLayer))) {
      (layer.nativeLayer as LeafletGeoLayer).removeFrom(this._map);
    }
  }

  removeMap(): void {
    // TODO(i.lobanov): implement
    this.removeComponents();
  }

  createBounds(latlngs: LatLngBoundsLiteral): LatLngBounds {
    return new LatLngBounds(latlngs);
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

  private createPopup(map: Map, marker: Marker, data: ILayerDef<T>): PopupComponentRefGetter<T> {
    let el: HTMLElement, compRef: ComponentRef<IPopupCmp<T>>;
    const popup = new Popup({ closeButton: false }, marker);
    marker.on('click', (e: LeafletEvent) => {
      this.zone.run(() => {
        if (compRef) {
          compRef.destroy();
        }
        const result = this.mapRendererService.render<IPopupCmp<T>>(data.popup, data.data);
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

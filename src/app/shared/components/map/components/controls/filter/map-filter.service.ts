import { Injectable, Inject } from '@angular/core';

import { ILayer, LayerType, IMapService } from '@app/core/map-providers/map-providers.interface';
import {
  IMapToolbarFilterItem,
} from '../toolbar/map-toolbar.interface';
import { MapFilters } from './map-filter.interface';

import { LayersService, LayerGroup, Layer } from '@app/core/map-providers/layers/map-layers.service';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

type FilterFn = (layer: ILayer<any>, params: any) => boolean;

@Injectable()
export class MapFilterService<T> {

  activeFilters = new Map<MapFilters, number[] | boolean>();

  filters: { [MapFilters: number]: FilterFn } = {

    [MapFilters.TOGGLE_INACTIVE]: (layer: ILayer<any>, params: boolean) =>
      layer.data.isInactive ? !!params : true,

    [MapFilters.ADDRESS_STATUS]: (layer: ILayer<any>, params: number[]) =>
      params.includes(layer.data.statusCode),

    [MapFilters.ADDRESS_TYPE]: (layer: ILayer<any>, params: number[]) =>
      params.includes(layer.data.addressTypeCode || layer.data.typeCode),

    [MapFilters.VISIT_STATUS]: (layer: ILayer<any>, params: number[]) =>
      params.includes(layer.data.visitStatus),

    [MapFilters.CONTACT_TYPE]: (layer: ILayer<any>, params: number[]) =>
      params.includes(layer.data.contactType),

  };

  constructor(
      private layersService: LayersService<T>,
      @Inject(MAP_SERVICE) private mapService: IMapService<T>,
    ) {}

  applyFilter(item: IMapToolbarFilterItem, params: any): void {
    switch (item.filter) {
      case MapFilters.RESET:
      case MapFilters.TOGGLE_ALL:
        this.layersService.show();
        break;
      case MapFilters.ADDRESS_STATUS:
      case MapFilters.ADDRESS_TYPE:
      case MapFilters.CONTACT_TYPE:
      case MapFilters.VISIT_STATUS:
      case MapFilters.TOGGLE_INACTIVE:
        this.activeFilters.set(item.filter, params);
        this.layersService
            .getLayers()
            .forEach(l => {
              const layer = l.isGroup ? (l as LayerGroup<T>).getLayersByType(LayerType.MARKER)[0] : l as Layer<T>;
              if (layer) {
                if (this.applyFilters(this.filters[item.filter], layer, params)) {
                  l.show();
                } else {
                  l.hide();
                }
              }
            });
        break;
      // now applies for groups only
      case MapFilters.TOGGLE_ACCURACY:
        this.layersService
          .getLayers()
          .forEach((g: LayerGroup<T>) => {
            if (g.isGroup) {
              const layerIds = g.getLayersByType(LayerType.CIRCLE).map(l => l.id);

              params ? g.hideByIds(layerIds) : g.showByIds(layerIds);
            }
          });
        break;
      // now applies for groups only
      case MapFilters.TOGGLE_ADDRESSES:
        this.layersService
          .getLayers()
          .forEach((g: LayerGroup<T>) => {
            if (g.isGroup) {
              const layerIds = g
                .getLayersByType(LayerType.MARKER)
                .filter(m => (m.data as any).addressLatitude
                  && (m.data as any).addressLongitude && !(m.data as any).isContact)
                .map(l => l.id);

              params ? g.hideByIds(layerIds) : g.showByIds(layerIds);
            }
          });
        break;
      // now applies for groups only
      case MapFilters.DISTANCE:
        this.layersService
          .getLayers()
          .forEach((g: LayerGroup<T>) => {
            if (g.isGroup) {
              g
              .getLayersByType(LayerType.MARKER)
              .filter(m => this.distanceFilter(m, params))
              .map(l => this.mapService.setIcon(l, 'addressByContact', params));
            }
          });
        break;
      default:
        throw new Error(`Unknown filter type: ${item.filter}`);
    }
  }

  setActiveFilters(checked: boolean, filters: number[]): void {
    if (checked) {
      filters.forEach(filter => typeof this.filters[filter] === 'function' ? this.activeFilters.set(filter, []) : null);
    } else {
      this.activeFilters.clear();
    }
  }

  private applyFilters(currentFilter: FilterFn, layer: ILayer<any>, params: number[]): boolean {
    return Array.from(this.activeFilters).reduce((acc, af: [number, number[] | boolean]) => acc ||
      (typeof this.filters[af[0]] === 'function' ? this.filters[af[0]](layer, af[1]) : acc), currentFilter(layer, params));
  }

  private distanceFilter(layer: ILayer<any>, params: number): boolean {
    return layer.data.isContact && layer.data.contactLatitude && layer.data.contactLongitude && Boolean(params);
  }
}

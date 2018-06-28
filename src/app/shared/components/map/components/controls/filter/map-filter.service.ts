import { Injectable, Inject } from '@angular/core';

import { ILayer, LayerType, IMapService } from '@app/core/map-providers/map-providers.interface';
import {
  IMapToolbarFilterItem,
} from '../toolbar/map-toolbar.interface';
import { MapFilters, IMapFilterMultiSelectOptions } from './map-filter.interface';

import { LayersService, LayerGroup, Layer } from '@app/core/map-providers/layers/map-layers.service';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

type FilterFn = (layer: ILayer<any>, params?: any) => boolean;

interface IFilterFnConfig {
  [MapFilters: number]: FilterFn;
}

@Injectable()
export class MapFilterService<T> {

  activeFilters = new Map<MapFilters, number[] | boolean>();
  activeVisibilityFilters = new Map<MapFilters, boolean>();
  originalFilters = new Map<MapFilters, number[] | boolean>();
  originalVisibilityFilters = new Map<MapFilters, boolean>();

  filters: IFilterFnConfig = {

    [MapFilters.ADDRESS_STATUS]: (layer: ILayer<any>, params: number[]) =>
      params.includes(layer.data.statusCode),

    [MapFilters.ADDRESS_TYPE]: (layer: ILayer<any>, params: number[]) =>
      params.includes(layer.data.addressTypeCode || layer.data.typeCode),

    [MapFilters.VISIT_STATUS]: (layer: ILayer<any>, params: number[]) =>
      params.includes(layer.data.visitStatus),

    [MapFilters.CONTACT_TYPE]: (layer: ILayer<any>, params: number[]) =>
      params.includes(layer.data.contactType),

    [MapFilters.TOGGLE_INACTIVE]: (layer: ILayer<any>, params: boolean) =>
      Boolean(layer.data.isInactive) ? params : true
  };

  visibilityFilters: IFilterFnConfig = {
    [MapFilters.TOGGLE_ADDRESSES]: (_, params: boolean) => params,
    [MapFilters.TOGGLE_ACCURACY]: (_, params: boolean) => params,
  };

  private _filters: IMapFilterMultiSelectOptions;

  constructor(
      private layersService: LayersService<T>,
      @Inject(MAP_SERVICE) private mapService: IMapService<T>,
    ) {}

  applyFilter(item: IMapToolbarFilterItem, params: any): void {
    switch (item.filter) {
      case MapFilters.RESET:
        this.restoreFilters();
        this.onFilterChange();
        break;
      case MapFilters.TOGGLE_INACTIVE:
      case MapFilters.ADDRESS_STATUS:
      case MapFilters.ADDRESS_TYPE:
      case MapFilters.CONTACT_TYPE:
      case MapFilters.VISIT_STATUS:
        this.activeFilters.set(item.filter, params);
        this.onFilterChange();
        break;
      // now applies for groups only
      case MapFilters.TOGGLE_ACCURACY:
        this.activeVisibilityFilters.set(item.filter, params);
        this.layersService
          .getLayers()
          .forEach((g: LayerGroup<T>) => {
            if (g.isGroup) {
              this.toggleAccuracy(g, params);
            }
          });
        break;
      // now applies for groups only
      case MapFilters.TOGGLE_ADDRESSES:
        this.activeVisibilityFilters.set(item.filter, params);
        this.layersService
          .getLayers()
          .forEach((g: LayerGroup<T>) => {
            if (g.isGroup) {
              this.toggleAddress(g, params);
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

  setActiveFilters( filters: IMapFilterMultiSelectOptions): void {
    this._filters = filters;
    this._setActiveFilters(filters);
    this._setActiveVisibilityFilters(filters);
    this.originalFilters = new Map(this.activeFilters);
    this.originalVisibilityFilters = new Map(this.activeVisibilityFilters);
    this.onFilterChange();
  }

  private restoreFilters(): void {
    this.activeFilters = new Map(this.originalFilters);
    this.activeVisibilityFilters = new Map(this.originalVisibilityFilters);
  }

  private _setActiveFilters(filters: IMapFilterMultiSelectOptions): void {
    for (const id in this._filters) {
      if (filters.hasOwnProperty(id)) {
        if (typeof this.filters[id] === 'function') {
          this.activeFilters.set(Number(id), this._filters[id]);
        }
      }
    }
  }

  private _setActiveVisibilityFilters(filters: IMapFilterMultiSelectOptions): void {
    for (const id in this._filters) {
      if (filters.hasOwnProperty(id)) {
        if (typeof this.visibilityFilters[id] === 'function') {
          this.activeVisibilityFilters.set(Number(id), this._filters[id] as boolean);
        }
      }
    }
  }

  private onFilterChange(): void {
    this.layersService
      .getLayers()
      .forEach(l => {
        const layer = l.isGroup ? (l as LayerGroup<T>).getLayersByType(LayerType.MARKER)[0] : l as Layer<T>;
        if (layer) {
          const show = this.applyFilters(layer);
          if (show) {
            l.show();
            if (l.isGroup) {
              this.applyVisibilityFilters(l as LayerGroup<T>);
            }
          } else {
            l.hide();
          }
        }
      });
  }

  private applyFilters(layer: ILayer<any>): boolean {
    let result = true;
    this.activeFilters.forEach((value, id) => {
      if (typeof this.filters[id] === 'function') {
        result = result && this.filters[id](layer, value);
      }
    });
    return result;
  }

  private applyVisibilityFilters(l: LayerGroup<any>): void {
    this.activeVisibilityFilters.forEach((value, id) => {
      if (id === MapFilters.TOGGLE_ACCURACY) {
        this.toggleAccuracy(l, value);
      }
      if (id === MapFilters.TOGGLE_ADDRESSES) {
        this.toggleAddress(l, value);
      }
    });
  }

  private toggleAddress(g: LayerGroup<T>, params: boolean): void {
    const layerIds = g
      .getLayersByType(LayerType.MARKER)
      .filter(m => (m.data as any).addressLatitude
        && (m.data as any).addressLongitude && !(m.data as any).isContact)
      .map(l => l.id);
    params ? g.hideByIds(layerIds) : g.showByIds(layerIds);
  }

  private toggleAccuracy(g: LayerGroup<T>, params: boolean): void {
    const layerIds = g.getLayersByType(LayerType.CIRCLE).map(l => l.id);
    params ? g.hideByIds(layerIds) : g.showByIds(layerIds);
  }


  private distanceFilter(layer: ILayer<any>, params: number): boolean {
    return layer.data.isContact && layer.data.contactLatitude && layer.data.contactLongitude && Boolean(params);
  }
}

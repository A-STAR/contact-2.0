import { Injectable } from '@angular/core';

import {
  IMapToolbarFilterItem,
  IMapFilterFn,
} from '../toolbar/map-toolbar.interface';
import { MapFilters } from './map-filter.interface';
import { ILayer, LayerType } from '@app/core/map-providers/map-providers.interface';

import { isEmpty } from '@app/core/utils';
import { LayersService } from '@app/core/map-providers/map-layers.service';

@Injectable()
export class MapFilterService<T> {
  defaultItems: { [MapFilters: number]: IMapFilterFn } = {
    [MapFilters.TOGGLE_ALL]: (_, params: boolean) => params,

    [MapFilters.RESET]: (_, __) => true,

    [MapFilters.INACTIVE]: (layer: ILayer<any>, _) =>
      Boolean(layer.data.isInactive),

    [MapFilters.ADDRESS_STATUS]: (layer: ILayer<any>, params: number[]) =>
      isEmpty(params) || params.includes(layer.data.statusCode),

    [MapFilters.ADDRESS_TYPE]: (layer: ILayer<any>, params: number[]) =>
      isEmpty(params) ||
      params.includes(layer.data.addressTypeCode || layer.data.typeCode),

    [MapFilters.VISIT_STATUS]: (layer: ILayer<any>, params: number[]) =>
      isEmpty(params) || params.includes(layer.data.visitStatus),

    [MapFilters.CONTACT_TYPE]: (layer: ILayer<any>, params: number[]) =>
      isEmpty(params) || params.includes(layer.data.contactType),

    [MapFilters.TOGGLE_ADDRESSES]: (_, params: boolean) => params,

    [MapFilters.TOGGLE_ACCURACY]: (_, params: boolean) => params
  };

  constructor(private layersService: LayersService<T>) {}

  applyFilter(item: IMapToolbarFilterItem, params: any): void {
    switch (item.filter) {
      case MapFilters.TOGGLE_ALL:
        const shouldShow = this.defaultItems[MapFilters.TOGGLE_ALL](null, params);
        shouldShow ? this.layersService.show() : this.layersService.hide();
        break;
      case MapFilters.RESET:
        this.layersService.show();
        break;
      case MapFilters.ADDRESS_STATUS:
      case MapFilters.ADDRESS_TYPE:
      case MapFilters.CONTACT_TYPE:
      case MapFilters.VISIT_STATUS:
        this.layersService
          .getGroups()
          .forEach(g => {
            const layer = g.getLayersByType(LayerType.MARKER)[0];
            if (layer) {
              const _shouldShow = this.defaultItems[item.filter as MapFilters](layer, params);
              _shouldShow ? g.show() : g.hide();
            }
          });
        break;
      case MapFilters.TOGGLE_ACCURACY:
        this.layersService
          .getGroups()
          .forEach(g => {
            const layerIds = g.getLayersByType(LayerType.CIRCLE)
            .map(l => l.id);

            this.defaultItems[item.filter as MapFilters](null, params) ? g.showByIds(layerIds) : g.hideByIds(layerIds);
          });
        break;
      case MapFilters.TOGGLE_ADDRESSES:
        this.layersService
          .getGroups()
          .forEach(g => {
            const layerIds = g
              .getLayersByType(LayerType.MARKER)
              .filter(m => (m.data as any).addressLatitude && (m.data as any).addressLongitude)
              .map(l => l.id);

              this.defaultItems[item.filter as MapFilters](null, params) ? g.showByIds(layerIds) : g.hideByIds(layerIds);
          });
        break;
      default:
         if (typeof item.filter === 'function') {
          this.layersService
          .getGroups()
          .forEach(g => {
            g
            .getLayers()
            .forEach(l => {
              const _show = this.defaultItems[item.filter as MapFilters](l, params);
              _show ? g.showByIds([l.id]) : g.hideByIds([l.id]);
            });
          });
         } else {
           throw new Error(`Unknown filter type: ${item.filter}`);
         }

    }
  }
}

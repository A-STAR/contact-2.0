import { Injectable, Inject } from '@angular/core';

import {
  IMapToolbarFilterItem,
  IMapFilterFn,
} from '../toolbar/map-toolbar.interface';
import { MapFilters } from './map-filter.interface';
import { IMapService } from '@app/core/map-providers/map-providers.interface';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';
import { isEmpty } from '@app/core/utils';

@Injectable()
export class MapFilterService<T> {

  defaultItems: { [MapFilters: number]: IMapFilterFn } = {
    [MapFilters.ALL]: (_, params: boolean) => params,
    [MapFilters.RESET]: (_, __) => true,
    [MapFilters.INACTIVE]: (entity, _) => Boolean(entity.data.isInactive),
    [MapFilters.ADDRESS_STATUS]: (entity, params: number[]) => isEmpty(params) || params.includes(entity.data.statusCode),
    [MapFilters.ADDRESS_TYPE]: (entity, params: number[]) => isEmpty(params) ||
      params.includes(entity.data.addressTypeCode || entity.data.typeCode),
    [MapFilters.VISIT_STATUS]: (entity, params: number[]) => isEmpty(params) || params.includes(entity.data.visitStatus),
    [MapFilters.CONTACT_TYPE]: (entity, params: number[]) => isEmpty(params) || params.includes(entity.data.contactType),
    [MapFilters.HIDE_ADDRESSES]: (entity, params: boolean) => !params &&
      !entity.data.addressLatitude || !entity.data.addressLongitude,
  };

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<T>,
  ) {}

  applyFilter(item: IMapToolbarFilterItem, params: any): void {
    this.mapService
      .getEntities()
      .forEach((entity: any) => {
        const isRemove = !this.getFilterType(item)(entity, params);
        this.mapService[isRemove ? 'removeFromMap' : 'addToMap'](entity);
      });
  }

  getFilterType(item: IMapToolbarFilterItem): IMapFilterFn {
    if (item && item.filter) {
      return typeof item.filter !== 'function' ? this.defaultItems[item.filter] : item.filter as IMapFilterFn;
    }
    return this.defaultItems[MapFilters.RESET];
  }

}

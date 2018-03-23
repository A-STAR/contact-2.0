import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridSelectFilterType, IGridSelectValue } from './grid-select.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { GridFiltersService } from '@app/core/filters/grid-filters.service';

import { addGridLabel } from '@app/core/utils';

@Injectable()
export class GridSelectService {

  private config = {
    entityGroups: {
      gridColumns: [
        { prop: 'id' },
        { prop: 'name' },
      ].map(addGridLabel('default.filters.entityGroups.grid')),
      fetchCallback: ({entityTypeId, isManual}) => this.gridFiltersService.fetchEntitiesGroups(entityTypeId, isManual),
      // title: 'default.filters.entityGroups.title',
      labelGetter: row => row.name,
      valueGetter: row => row.id,
    },
  };

  constructor(
    private gridFiltersService: GridFiltersService,
  ) {}

  getGridColumns(key: IGridSelectFilterType): ISimpleGridColumn<any>[] {
    return this.config[key].gridColumns;
  }

  getFetchCallback(key: IGridSelectFilterType): (filterParams: any) => Observable<any> {
    return this.config[key].fetchCallback;
  }

  getLabelGetter(key: IGridSelectFilterType): (row: any) => string {
    return this.config[key].labelGetter;
  }

  getValueGetter(key: IGridSelectFilterType): (row: any) => IGridSelectValue {
    return this.config[key].valueGetter;
  }

}

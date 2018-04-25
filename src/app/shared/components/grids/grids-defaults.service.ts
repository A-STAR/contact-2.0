import { Injectable } from '@angular/core';

import { GridApi, ColumnApi } from 'ag-grid';
import { IGridColumn, IGridLocalSettings } from '@app/shared/components/grids/grids.interface';

import { SettingsService } from '@app/core/settings/settings.service';

@Injectable()
export class GridsDefaultsService {

  private defaultSettings: IGridLocalSettings;
  private persistenceKey: string;

  constructor(
    private settingsService: SettingsService,
  ) { }

  save<T>(columns: IGridColumn<T>[], persistenceKey: string): void {
    this.defaultSettings = {
      columns: columns
        .filter(col => col.prop)
        .map(column => ({
            width: column.maxWidth || column.minWidth || 200,
            isVisible: column.isGroup,
            colId: column.prop,
          })
        ),
      sortModel: [],
    };
    this.persistenceKey = persistenceKey;
  }

  reset(gridApi: GridApi, columnApi: ColumnApi): void {
    columnApi.setColumnState(this.defaultSettings.columns);
    gridApi.setSortModel(this.defaultSettings.sortModel);
    this.setLocalSettings(this.persistenceKey, this.defaultSettings);
  }

  private setLocalSettings(key: string, settings: IGridLocalSettings): void {
    this.settingsService.set(key, settings);
  }

}

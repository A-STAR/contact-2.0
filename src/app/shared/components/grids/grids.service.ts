import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColDef, ColumnApi, GridApi } from 'ag-grid';
import { Observable } from 'rxjs/Observable';

import { IGridColumn, IGridFilterType, IGridLocalSettings, IGridTreePath } from './grids.interface';
import { IUserDictionaries } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { PersistenceService } from '@app/core/persistence/persistence.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { CallbackRendererComponent, DictRendererComponent, LookupRendererComponent, ValueRendererComponent } from './renderers';
import { ValueEditorComponent } from '@app/shared/components/grids/editors';

@Injectable()
export class GridsService {
  constructor(
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  convertColumnsToColDefs<T>(columns: IGridColumn<T>[], persistenceKey: string): ColDef[] {
    const savedColumns = persistenceKey
      ? this.getLocalSettings(persistenceKey).columns
      : [];
    this.preloadDictionaries(columns);
    const columnIds = columns.map(c => c.prop);
    const savedColumnIds = savedColumns.map(c => c.colId);
    const ids = Array.from(new Set([ ...savedColumnIds, ...columnIds ]));

    return ids
      .map(id => {
        const column = columns.find(c => c.prop === id);
        return column
          ? {
              field: column.prop,
              headerName: this.translateService.instant(column.label),
              hide: column.isGroup,
              minWidth: column.minWidth,
              maxWidth: column.maxWidth,
              valueGetter: column.valueGetter,
              editable: column.editable,
              ...this.getFilterOptions(column),
              ...this.getCellRendererOptions(column),
              ...(savedColumns.find(c => c.colId === id) || {}),
              ...this.getCellEditorOptions(column),
            }
          : null;
      })
      .filter(Boolean);
  }

  getRowGrouping<T>(columns: IGridColumn<T>[]): ColDef {
    return columns
          .filter(c => c.isGroup)
          .slice(0, 1)
          .map(col => ({
              headerName: this.translateService.instant(col.label),
              minWidth: col.minWidth,
              maxWidth: col.maxWidth,
              cellRendererParams: {
                suppressCount: true
              }
            })
          ).shift();
  }

  restoreSortModel(persistenceKey: string, gridApi: GridApi): void {
    if (!persistenceKey) {
      return;
    }
    const sortModel = this.getLocalSettings(persistenceKey).sortModel;
    gridApi.setSortModel(sortModel);
  }

  saveSettings(persistenceKey: string, gridApi: GridApi, columnApi: ColumnApi): void {
    if (!persistenceKey) {
      return;
    }
    const columns = columnApi.getAllGridColumns().map(column => ({
      colId: column.getId(),
      isVisible: column.isVisible(),
      width: column.getActualWidth(),
    }));
    const sortModel = gridApi.getSortModel();
    this.setLocalSettings(persistenceKey, { columns, sortModel });
  }

  convertTreeData<T>(data: T[], prop: string = 'name', parent?: IGridTreePath): (T & IGridTreePath)[] {
    return data.reduce((acc, item: T & IGridTreePath) => {
      item.path = parent ? [...parent.path, item[prop]] : [item[prop]];
      return [
        ...acc,
        item,
        ...(item.children && item.children.length ? this.convertTreeData(item.children, prop, item) : [])
      ];
    }, [])
    // remove children property
    .map(result => {
      const { children, ...rest } = result;
      return rest;
    });
  }

  private preloadDictionaries<T>(columns: IGridColumn<T>[]): Observable<IUserDictionaries> {
    // TODO(d.maltsev): remove duplicates
    const dictCodes = columns
      .map(column => Number(column.dictCode))
      .filter(Boolean);
    return this.userDictionariesService.getDictionaries(dictCodes);
  }

  private getCellRendererOptions<T>(column: IGridColumn<T>): Partial<ColDef> {
    const { dictCode, lookupKey, renderer, valueTypeKey, rendererCallback } = column;
    switch (true) {
      case Boolean(renderer):
        return {
          cellRendererFramework: renderer,
        };
      case Boolean(dictCode):
        return {
          cellRendererFramework: DictRendererComponent,
          cellRendererParams: { dictCode },
        };
      case Boolean(lookupKey):
        return {
          cellRendererFramework: LookupRendererComponent,
          cellRendererParams: { lookupKey },
        };
      case Boolean(valueTypeKey):
        return {
          cellRendererFramework: ValueRendererComponent,
          cellRendererParams: { valueTypeKey },
        };
      case Boolean(rendererCallback):
        return {
          cellRendererFramework: CallbackRendererComponent,
          cellRendererParams: { rendererCallback },
        };
      default:
        return {};
    }
  }

  private getCellEditorOptions<T>(column: IGridColumn<T>): Partial<ColDef> {
    const { editable, valueTypeKey, dictCode, lookupKey } = column;
    if (editable) {
      return {
        cellEditorFramework: ValueEditorComponent,
        cellEditorParams: { valueTypeKey, dictCode, lookupKey }
      };
    }
    return {};
  }

  private getFilterOptions<T>(column: IGridColumn<T>): Partial<ColDef> {
    switch (column.filter) {
      case IGridFilterType.NUMBER:
        return { filter: 'agNumberColumnFilter' };
      case IGridFilterType.TEXT:
        return { filter: 'agTextColumnFilter' };
      case IGridFilterType.DATE:
        return { filter: 'agDateColumnFilter' };
      default:
        return { suppressFilter: true };
    }
  }

  private setLocalSettings(key: string, settings: IGridLocalSettings): void {
    this.persistenceService.set(key, settings);
  }

  private getLocalSettings(key: string): IGridLocalSettings {
    return this.persistenceService.get(key) || { columns: [], sortModel: {} };
  }

}

import { Injectable } from '@angular/core';
import { ColDef } from 'ag-grid';
import { TranslateService } from '@ngx-translate/core';

import { IGridColumn, IGridTreePath } from '@app/shared/components/grids/grids.interface';

import { GridsDefaultsService } from '@app/shared/components/grids/grids-defaults.service';
import { GridsService } from './grids.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { StateTree } from '@app/core/utils/state-tree';

@Injectable()
export class GridsTreeActionService extends GridsService {
  private actionKeys: string[] = [];
  private stateTree: StateTree;

  constructor(
    settingsService: SettingsService,
    translateService: TranslateService,
    userDictionariesService: UserDictionariesService,
  ) {
    super(
      settingsService,
      translateService,
      userDictionariesService
    );
    this.stateTree = new StateTree({
      transformState: (prev, next) => prev + next,
      dataToState: this.dataToState.bind(this)
    });
   }

  /**
  * @override
  */
   convertColumnsToColDefs<T>(columns: IGridColumn<T>[], persistenceKey: string, defaults?: GridsDefaultsService): ColDef[] {
     this.actionKeys = columns.filter(c => c.hasAction).map(column => column.prop);
     const colDefs = super.convertColumnsToColDefs(columns, persistenceKey, defaults);
      colDefs
        .filter(col => this.actionKeys.includes(col.colId))
        .forEach(c => c.cellRendererParams = {
          ...c.cellRendererParams,
          stateTree: this.stateTree
        });
      return colDefs;
  }
   /**
    * @override
    * @param data
    * @param prop
    * @param parent
    */
   convertTreeData<T>(data: T[], prop: string = 'name', parent?: IGridTreePath): (T & IGridTreePath)[] {

    return data.reduce((acc, item: T & IGridTreePath) => {
      item.path = parent ? [...parent.path, item[prop]] : [item[prop]];

      this.stateTree.addNode(item.path, this.dataToState(item));

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

  private dataToState(row: any): number {
    return this.actionKeys.reduce((acc: number, key) => acc + Number(row[key]), 0);
  }

}

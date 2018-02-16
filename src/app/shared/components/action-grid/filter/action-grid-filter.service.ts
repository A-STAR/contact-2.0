import { Injectable } from '@angular/core';

import {
  IGridActionFilterParams,
  IGridActionParams,
  IGridActionPayload,
  ISelectionIds,
} from '../action-grid.interface';
import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { MetadataActionType } from '@app/core/metadata/metadata.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class ActionGridFilterService {

  constructor() { }

  buildRequest(actionData: IGridActionPayload): any {
    if (actionData.type === MetadataActionType.ALL) {
      return {
        ...actionData.data,
        ...this.getFilters((actionData.data as IGridActionFilterParams).filtering)
      };
    }

    if (actionData.type === MetadataActionType.SINGLE) {
      return actionData.data;
    }

    return {
      ids: actionData.data
    };
  }
  /**
   * Returns selection from grid filtered by config params
   * and without undefined and null values.
   * NOTE: This method should be marked as private when action handle logic
   * is moved here from action grid cmp!
   * @param action
   * @param selected
   */
  getSelection(action: IAGridAction, selected: any[]): number[][] {
    return selected.reduce((acc, row, i) => {
      return [
        ...acc,
        [...action.metadataAction.params
          .map(param => row[param])
          // filter null and undefined params
          .filter(value => value != null)
        ]
      ];
    }, []);
  }
  /**
   * Returns selection from grid filtered by config params.
   * NOTE: it returns also undefined or null values!
   * NOTE: This method should be marked as private when action handle logic
   * is moved here from action grid cmp!
   * @param action
   * @param selected
   */
  getGridSelection(action: IAGridAction, selected: any[]): number[][] {
    return selected.reduce((acc, row, i) => {
      return [
        ...acc,
        [...action.metadataAction.params
          .map(param => row[param])
        ]
      ];
    }, []);
  }

  getSingleSelection(action: IAGridAction, selection: any): { [key: string]: any } {
    return action.metadataAction.params.reduce((acc, param) => ({ ...acc, [param]: selection[param] }), {});
  }

  getSelectionCount(actionData: IGridActionPayload): number | null {
    return actionData.type === MetadataActionType.SELECTED ? (actionData as ISelectionIds).data.length : null;
  }

  getAddOptions(action: IGridActionParams, name: string): (number|string)[] {
    // TODO(d.maltsev): not optimized; better to convert to key: value object on initialization
    // TODO(i.lobanov): why store it that way in json config?
    const found = action.addOptions.find(option => option.name === name);
    return found ? found.value : null;
  }

  getAddOption(action: IGridActionParams, name: string, index: number): number|string {
    const options = this.getAddOptions(action, name);
    if (options && options.length > index) {
      return options[index];
    }
  }

  isFilterAction(actionData: IGridActionPayload): boolean {
    return actionData.type === MetadataActionType.ALL;
  }

  private getFilters(filters?: FilterObject): { filtering: FilterObject | null } {
    return {
      filtering: filters && (filters.hasFilter() || filters.hasValues()) ? filters : null
    };
  }


}

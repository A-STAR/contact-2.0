import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  IGridActionFilterSelection,
  IGridAction,
  IGridActionPayload,
  IGridActionSelection,
  IGridActionContext,
} from '../action-grid.interface';
import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { MetadataActionType } from '@app/core/metadata/metadata.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class ActionGridFilterService {

  private actionPayloads = {
    [MetadataActionType.ALL]: this.getFilterPayload,
    [MetadataActionType.SELECTED]: this.getSelectionPayload,
    [MetadataActionType.SINGLE]: this.getSingleSelectionPayload,
  };
  // notify subscribers, that grid has filters
  hasFilter$ = new BehaviorSubject<boolean>(null);

  constructor() { }

  buildRequest(actionData: IGridActionPayload): any {
    if (actionData.type === MetadataActionType.ALL) {
      return {
        ...actionData.data,
        ...this.getFilters((actionData.data as IGridActionFilterSelection).filtering)
      };
    }

    if (actionData.type === MetadataActionType.SINGLE) {
      return actionData.data;
    }

    return {
      ids: actionData.data
    };
  }

  getPayload(action: IAGridAction, params?: IGridActionContext): IGridActionPayload {
    return (this.actionPayloads[action.metadataAction.type]
        || this.actionPayloads[MetadataActionType.SINGLE]).call(this, action, params);
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

  getSelectionCount(actionData: IGridActionPayload): number | null {
    return actionData.type === MetadataActionType.SELECTED ? (actionData.data as IGridActionSelection).length : null;
  }

  getAddOptions(action: IGridAction, name: string): (number|string)[] {
    // TODO(d.maltsev): not optimized; better to convert to key: value object on initialization
    // TODO(i.lobanov): why store it that way in json config?
    const found = action.addOptions.find(option => option.name === name);
    return found ? found.value : null;
  }

  getAddOption(action: IGridAction, name: string, index: number): number|string {
    const options = this.getAddOptions(action, name);
    if (options && options.length > index) {
      return options[index];
    }
  }

  getSelectionPayload(action: IAGridAction, params: IGridActionContext): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: this.getSelection(action, params.selection)
    };
  }

  getFilterPayload(action: IAGridAction, params: IGridActionContext): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: {
        filtering: this.getFilters(params.filters),
        gridName: params.metadataKey,
        columnNames: action.metadataAction.params
      }
    };
  }

  getSingleSelectionPayload(action: IAGridAction, params: IGridActionContext): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: this.getSingleSelection(action, action.selection.node.data)
    };
  }


  isFilterAction(actionData: IGridActionPayload): boolean {
    return actionData.type === MetadataActionType.ALL;
  }

  private getSingleSelection(action: IAGridAction, selection: any): any {
    return action.metadataAction.params.reduce((acc, param) => ({ ...acc, [param]: selection[param] }), {});
  }

  private getFilters(filters?: FilterObject): FilterObject | null {
    return filters && (filters.hasFilter() || filters.hasValues()) ? filters : null;
  }
}

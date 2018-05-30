import { Injectable } from '@angular/core';

import { ContextOperator, IContext } from '@app/core/context/context.interface';
import {
  IMetadataAction,
  MetadataActionType,
} from '@app/core/metadata/metadata.interface';

import {
  IMetadataActionSetter,
  IGridAction,
  IActionGridAction,
  IGridActionContext,
  IGridActionPayload,
  IGridActionSelection,
  IGridActionFilterSelection } from '@app/shared/components/action-grid/action-grid.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { MassOperationsService } from '@app/shared/mass-ops/mass-ops.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

import { compose } from 'ramda';

@Injectable()
export class ActionGridService {

  static DefaultSelectionAction = 'showContactHistory';

  cbActions: { [key: string]: (action: IGridAction) => any };

  private actionPayloads = {
    [MetadataActionType.ALL]: this.getFilterPayload,
    [MetadataActionType.SELECTED]: this.getSelectionPayload,
    [MetadataActionType.SINGLE]: this.getSingleSelectionPayload,
  };

  readonly actionValidators: { [key: string]: (a?: IMetadataAction) => IContext } = {
    addVisit: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'ADDRESS_VISIT_ADD'
    }),
    cancelVisit: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'VISIT_CANCEL'
    }),
    changeBranchAttr: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_EDIT'
    }),
    changeCreditTypeAttr: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_EDIT'
    }),
    changeDict1Attr: _ => ({
      operator: ContextOperator.AND,
      value: [
        {
          operator: ContextOperator.PERMISSION_NOT_EMPTY,
          value: 'DEBT_DICT1_EDIT_LIST'
        },
        {
          operator: ContextOperator.ENTITY_IS_USED,
          value: EntityAttributesService.DICT_VALUE_1
        }
      ]
    }),
    changeDict2Attr: _ => ({
      operator: ContextOperator.AND,
      value: [
        {
          operator: ContextOperator.PERMISSION_NOT_EMPTY,
          value: 'DEBT_DICT2_EDIT_LIST'
        },
        {
          operator: ContextOperator.ENTITY_IS_USED,
          value: EntityAttributesService.DICT_VALUE_2
        }
      ]
    }),
    changeDict3Attr: _ => ({
      operator: ContextOperator.AND,
      value: [
        {
          operator: ContextOperator.PERMISSION_NOT_EMPTY,
          value: 'DEBT_DICT3_EDIT_LIST'
        },
        {
          operator: ContextOperator.ENTITY_IS_USED,
          value: EntityAttributesService.DICT_VALUE_3
        }
      ]
    }),
    changeDict4Attr: _ => ({
      operator: ContextOperator.AND,
      value: [
        {
          operator: ContextOperator.PERMISSION_NOT_EMPTY,
          value: 'DEBT_DICT4_EDIT_LIST'
        },
        {
          operator: ContextOperator.ENTITY_IS_USED,
          value: EntityAttributesService.DICT_VALUE_4
        }
      ]
    }),
    changePersonType: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'PERSON_INFO_EDIT'
    }),
    changePortfolioAttr: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_PORTFOLIO_EDIT'
    }),
    changeRegionAttr: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_EDIT'
    }),
    changeStageAttr: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_EDIT'
    }),
    changeTimezoneAttr: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_EDIT'
    }),
    confirmPaymentsOperator: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'PAYMENTS_OPERATOR_CHANGE'
    }),
    confirmPromise:  _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'PROMISE_CONFIRM'
    }),
    debtClearResponsible: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_RESPONSIBLE_CLEAR'
    }),
    debtNextCallDate:  _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_NEXT_CALL_DATE_SET'
    }),
    debtOutsourcingExclude: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_OUTSOURCING_SEND'
    }),
    debtOutsourcingReturn: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_OUTSOURCING_RETURN'
    }),
    debtOutsourcingSend: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'DEBT_OUTSOURCING_SEND'
    }),
    debtSetResponsible: _ => ({
      operator: ContextOperator.OR,
      value: [
        { operator: ContextOperator.PERMISSION_IS_TRUE, value: 'DEBT_RESPONSIBLE_SET' },
        { operator: ContextOperator.PERMISSION_IS_TRUE, value: 'DEBT_RESPONSIBLE_RESET' },
      ]
    }),
    deletePromise: _ => ({
      operator: ContextOperator.OR,
      value: [
        { operator: ContextOperator.PERMISSION_IS_TRUE, value: 'PROMISE_DELETE' },
        { operator: ContextOperator.PERMISSION_IS_TRUE, value: 'PROMISE_CONFIRM' },
      ]
    }),
    deleteSMS: _ => ({
      operator: ContextOperator.PERMISSION_NOT_EMPTY,
      value: 'SMS_DELETE_STATUS_LIST'
    }),
    emailCreate: action => ({
      operator: ContextOperator.AND,
      value: [
        {
          operator: ContextOperator.CONSTANT_IS_TRUE,
          value: 'Email.Use'
        },
        {
          operator: ContextOperator.PERMISSION_CONTAINS,
          value: [
            'EMAIL_SINGLE_FORM_PERSON_ROLE_LIST',
            this.getAddOption(action, 'personRole', 0)
          ]
        },
      ]
    }),
    mapAddressView: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'MAP_ADDRESS_VIEW'
    }),
    mapContactView: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'MAP_CONTACT_VIEW'
    }),
    objectAddToGroup: _ => ({
      operator: ContextOperator.PERMISSION_CONTAINS,
      value: [ 'ADD_TO_GROUP_ENTITY_LIST', 19 ]
    }),
    openUserDetail: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'OPERATOR_DETAIL_VIEW'
    }),
    paymentsCancel: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'PAYMENT_CANCEL'
    }),
    paymentsConfirm: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'PAYMENT_CONFIRM'
    }),
    prepareVisit: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'VISIT_PREPARE'
    }),
    rejectPaymentsOperator: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'PAYMENTS_OPERATOR_CHANGE'
    }),
    showContactHistory: _ => ({
      operator: ContextOperator.PERMISSION_IS_TRUE,
      value: 'CONTACT_LOG_VIEW'
    }),
    smsCreate: action => ({
      operator: ContextOperator.AND,
      value: [
        {
          operator: ContextOperator.CONSTANT_IS_TRUE,
          value: 'SMS.Use'
        },
        {
          operator: ContextOperator.PERMISSION_CONTAINS,
          value: [
            'SMS_SINGLE_FORM_PERSON_ROLE_LIST',
            this.getAddOption(action, 'personRole', 0)
          ]
        },
      ]
    }),
    // in case if this action would have permission in the future
    registerContact: _ => true
  };

  constructor(
    private massOpsService: MassOperationsService,
  ) {
    this.cbActions = this.createDlgActions();
  }

  getAction(
    actions: IMetadataAction[],
    matcher: (action: IMetadataAction) => boolean,
    onFound: (actions: IMetadataAction[], found: IMetadataAction, index: number) => void = () => null
  ): IMetadataAction {

      let found: IMetadataAction;

      actions.some(function iter(action: IMetadataAction, index: number): boolean {
        if (matcher(action)) {
          found = action;
          onFound(actions, action, index);
          return true;
        }
        return Array.isArray(action.children) && action.children.some(iter);
      });
      return found;
  }

  /**
   * Recursively attaches data to actions and it's children
   * @param actions Array of actions
   * @param setters Array of data setters
  */
  setActionsData(actions: IMetadataAction[], setters?: IMetadataActionSetter[]): IMetadataAction[] {
    const noop = [ action => action ];
    return actions.map(action => ({
        ...action,
        // apply action setters in pipe
        ...(compose as any)(...(setters || noop))(action),
        children: action.children ? this.setActionsData(action.children, setters) : undefined
      })
    );
  }

  /**
   * Recursively attaches data to action and it's children
   * @param action Metadata action
   * @param setters Array of data setters
  */
  setActionData(action: IMetadataAction, setters?: IMetadataActionSetter[]): IMetadataAction {
    const noop = [ a => a ];
    return ({
      ...action,
      // apply action setters in pipe
      ...(compose as any)(...(setters || noop))(action),
      children: action.children && action.children.length ? action.children.map(a => this.setActionData(a, setters)) : undefined
    });
  }

  buildRequest(actionData: IGridActionPayload): any {
    switch (actionData.type) {
      case MetadataActionType.ALL:
        return {
          ...actionData.data,
          filtering: this.getFilters((actionData.data as IGridActionFilterSelection).filtering)
        };
      case MetadataActionType.SELECTED:
        return {
          ids: actionData.data
        };
      case MetadataActionType.SINGLE:
      default:
        return actionData.data;
    }
  }

  getPayload(action: IActionGridAction, params?: IGridActionContext): IGridActionPayload {
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
  getSelection(action: IActionGridAction, selected: any[]): number[][] {
    return selected.reduce((acc, row) => {
      const mappedParams = [...action.metadataAction.params
        .map(param => row[param])
        // filter null and undefined params
        .filter(value => value != null)
      ];
      return mappedParams.length ? [...acc, mappedParams ] : acc;
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
  getGridSelection(action: IActionGridAction, selected: any[]): number[][] {
    return selected.reduce((acc, row) => {
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

  hasParamKey(paramKey: string, action: IGridAction | IMetadataAction): boolean {
    return action.params && action.params.includes(paramKey);
  }

  getAddOptions(action: IGridAction | IMetadataAction, name: string): (number|string)[] {
    // TODO(d.maltsev): not optimized; better to convert to key: value object on initialization
    // TODO(i.lobanov): why store it that way in json config?
    const found = action.addOptions.find(option => option.name === name);
    return found ? found.value : null;
  }

  getAddOption(action: IGridAction | IMetadataAction, name: string, index: number): number|string {
    const options = this.getAddOptions(action, name);
    if (options && options.length > index) {
      return options[index];
    }
  }

  getSelectionPayload(action: IActionGridAction, params: IGridActionContext): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: this.getSelection(action, params.selection)
    };
  }

  getFilterPayload(action: IActionGridAction, params: IGridActionContext): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: {
        filtering: this.getFilters(params.filters),
        gridName: params.metadataKey,
        columnNames: action.metadataAction.params
      }
    };
  }

  getSingleSelectionPayload(action: IActionGridAction): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: this.getSingleSelection(action, action.selection)
    };
  }


  isFilterAction(actionData: IGridActionPayload): boolean {
    return actionData.type === MetadataActionType.ALL;
  }

  private getSingleSelection(action: IActionGridAction, selection: any): any {
    return action.metadataAction.params.reduce((acc, param) => ({ ...acc, [param]: selection[param] }), {});
  }

  private getFilters(filters?: FilterObject): FilterObject | null {
    return filters && (filters.hasFilter() || filters.hasValues()) ? filters : null;
  }

  private createDlgActions(): { [key: string]: (action: IGridAction) => any } {
    return Object.keys(this.massOpsService.nonDlgActions).reduce((acc, actionName) => ({
      ...acc,
      [actionName]: (actionData: any, onClose?: Function) =>
        this.massOpsService.nonDlgActions[actionName](this.buildRequest(actionData.payload), onClose)
    }), {});
  }

}

import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IReportInputParam, IReportParamValue } from './params.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ParamsService extends AbstractActionService {
  static MESSAGE_PARAM_SAVED = 'MESSAGE_PARAM_SAVED';

  private baseUrl = '/reports/{reportId}';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(reportId: number): Observable<IReportInputParam[]> {
    return this.dataService.readAll(`${this.baseUrl}/params`, { reportId })
      .catch(this.notificationsService.fetchError().entity('entities.params.gen.plural').dispatchCallback());
  }

  createInputParamControl(inputParam: IReportInputParam): IDynamicFormControl {
    const control = {
      label: inputParam.name,
      controlName: inputParam.systemName,
      required: !!inputParam.isMandatory,
    };
    switch (inputParam.paramTypeCode) {
      case 1: return { ...control, type: 'datepicker' } as IDynamicFormControl;
      case 2: return { ...control, type: 'number' } as IDynamicFormControl;
      case 3: case 8: return {
        ...control,
        type: 'dialogmultiselectwrapper',
        filterType: 'portfolios',
        filterParams: { directionCodes: [ 1 ] },
      } as IDynamicFormControl;
      case 4: return {
        ...control,
        type: 'dialogmultiselectwrapper',
        filterType: 'users'
      } as IDynamicFormControl;
      case 5: return {
        ...control,
        type: 'dialogmultiselectwrapper',
        filterType: 'contractors'
      } as IDynamicFormControl;
      case 6: return { ...control, type: 'text' } as IDynamicFormControl;
      case 7: return {
        ...control,
        type: inputParam.multiSelect ? 'multiselect' : 'select',
        dictCode: inputParam.dictNameCode
      } as IDynamicFormControl;
      case 9: return { ...control, type: 'checkbox' } as IDynamicFormControl;
      case 10: return { ...control, type: 'datetimepicker' } as IDynamicFormControl;
    }
  }

  parseInputParamControls(controls: { [paramName: string]: any }): IReportParamValue[] {
    return Object.keys(controls)
      .map(paramName => ({
        name: paramName,
        values: Array.isArray(controls[paramName])
          ? controls[paramName].map(v => String(v))
          : [ String(controls[paramName]) ]
      }));
  }
}

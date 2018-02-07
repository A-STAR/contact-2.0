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
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ParamsService extends AbstractActionService {
  static MESSAGE_PARAM_SAVED = 'MESSAGE_PARAM_SAVED';

  private baseUrl = '/reports/{reportId}';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(reportId: number): Observable<IReportInputParam[]> {
    return this.dataService.readAll(`${this.baseUrl}/params`, { reportId })
      .catch(this.notificationsService.fetchError().entity('entities.params.gen.plural').dispatchCallback());
  }

  createInputParamControls(inputParams: IReportInputParam[]): Observable<IDynamicFormControl[]> {
    return combineLatest(inputParams
      .map(inputParam => this.createInputParamControl(inputParam) as any)
      .map(control => control.dictCode
        ? this.userDictionariesService.getDictionaryAsOptions(control.dictCode)
          .map(options => ({ ...control, options }))
        : of(control)
      )
    );
  }

  createInputParamControl(inputParam: IReportInputParam): Partial<IDynamicFormControl> {
    const control = {
      label: inputParam.name,
      controlName: inputParam.systemName,
      required: !!inputParam.isMandatory,
    };
    switch (inputParam.paramTypeCode) {
      case 1: return { ...control, type: 'datepicker' };
      case 2: return { ...control, type: 'number' };
      case 3: case 8: return {
        ...control,
        type: 'dialogmultiselect',
        filterType: 'portfolios',
        filterParams: { directionCodes: [ 1 ] },
      };
      case 4: return {
        ...control,
        type: 'dialogmultiselect',
        filterType: 'users'
      };
      case 5: return {
        ...control,
        type: 'dialogmultiselect',
        filterType: 'contractors'
      };
      case 6: return { ...control, type: 'text' };
      case 7: return {
        ...control,
        type: inputParam.multiSelect ? 'multiselect' : 'select',
        dictCode: inputParam.dictNameCode
      };
      case 9: return { ...control, type: 'checkbox' };
      case 10: return { ...control, type: 'datetimepicker' };
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

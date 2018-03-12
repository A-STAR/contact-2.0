import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IAppState } from '@app/core/state/state.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IReportInputParam, IReportParamValue } from './params.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { GridFiltersService } from '@app/core/filters/grid-filters.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addGridLabel } from '@app/core/utils';

@Injectable()
export class ParamsService extends AbstractActionService {
  static MESSAGE_PARAM_SAVED = 'MESSAGE_PARAM_SAVED';

  private baseUrl = '/reports/{reportId}';

  private gridConfig = {
    portfolios: {
      gridColumns: [
        { prop: 'id', maxWidth: 70 },
        { prop: 'name' },
        { prop: 'contractorName' },
        { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS },
        { prop: 'stageCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE },
        { prop: 'directionCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION },
        { prop: 'signDate' },
        { prop: 'startWorkDate', renderer: 'dateTimeRenderer' },
        { prop: 'endWorkDate', renderer: 'dateTimeRenderer' },
      ]
      .map(c => ({ ...c, name: this.translateService.instant(`default.filters.portfolios.grid.${c.prop}`) }))
      .map(addGridLabel('default.filters.portfolios.grid')),
      gridLabelGetter: row => row.name,
      gridValueGetter: row => row.id,
    },
    users: {
      gridColumns: [
        { prop: 'id', maxWidth: 70 },
        { prop: 'fullName' },
        { prop: 'organization' },
        { prop: 'position' },
      ]
      .map(c => ({ ...c, name: this.translateService.instant(`default.filters.users.grid.${c.prop}`) }))
      .map(addGridLabel('default.filters.users.grid')),
      gridLabelGetter: row => row.fullName,
      gridValueGetter: row => row.id,
    },
    contractors: {
      gridColumns: [
        { prop: 'id', maxWidth: 70 },
        { prop: 'name' },
        { prop: 'fullName' },
        { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE },
        { prop: 'comment' },
      ]
      .map(c => ({ ...c, name: this.translateService.instant(`default.filters.contractors.grid.${c.prop}`) }))
      .map(addGridLabel('default.filters.contractors.grid')),
      gridLabelGetter: row => row.fullName,
      gridValueGetter: row => row.id,
    },
  };

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private gridFiltersService: GridFiltersService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
    private translateService: TranslateService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(reportId: number): Observable<IReportInputParam[]> {
    return this.dataService.readAll(`${this.baseUrl}/params`, { reportId })
      .catch(this.notificationsService.fetchError().entity('entities.params.gen.plural').dispatchCallback());
  }

  createInputParamControls(inputParams: IReportInputParam[]): Observable<IDynamicFormControl[]> {
    return combineLatest(inputParams.map(inputParam => this.createInputParamControl(inputParam)));
  }

  createInputParamControl(inputParam: IReportInputParam): Observable<IDynamicFormControl> {
    const control = this.createInputParamControlDef(inputParam) as any;
    if (!inputParam.multiSelect) {
      switch (inputParam.paramTypeCode) {
        case 3:
        case 8:
          return this.gridFiltersService.fetchPortfolios(null, [ 1 ])
            .map(portfolios => ({ ...control, gridRows: portfolios }));
        case 4:
          return this.gridFiltersService.fetchUsers(0)
            .map(users => ({ ...control, gridRows: users }));
        case 5:
          return this.gridFiltersService.fetchContractors()
            .map(contractors => ({ ...control, gridRows: contractors }));
      }
    }
    if (control.dictCode) {
      return this.userDictionariesService.getDictionaryAsOptions(control.dictCode)
        .map(options => ({ ...control, options }));
    }
    return of(control);
  }

  createInputParamControlDef(inputParam: IReportInputParam): Partial<IDynamicFormControl> {
    const control = {
      label: inputParam.name,
      controlName: inputParam.systemName,
      required: !!inputParam.isMandatory,
      markAsDirty: !inputParam.isMandatory
    };
    switch (inputParam.paramTypeCode) {
      case 1: return { ...control, type: 'datepicker' };
      case 2: return { ...control, type: 'number' };
      case 3:
      case 8:
        return inputParam.multiSelect
          ? {
              ...control,
              type: 'dialogmultiselect',
              filterType: 'portfolios',
              filterParams: { directionCodes: [ 1 ] },
            }
          : {
              ...control,
              type: 'gridselect',
              ...this.gridConfig.portfolios
            } as Partial<IDynamicFormControl>;
      case 4: return inputParam.multiSelect
        ? {
            ...control,
            type: 'dialogmultiselect',
            filterType: 'users'
          }
        : {
            ...control,
            type: 'gridselect',
            ...this.gridConfig.users
          } as Partial<IDynamicFormControl>;
      case 5: return  inputParam.multiSelect
        ? {
            ...control,
            type: 'dialogmultiselect',
            filterType: 'contractors'
          }
        : {
            ...control,
            type: 'gridselect',
            ...this.gridConfig.contractors
          } as Partial<IDynamicFormControl>;
      case 6: return { ...control, type: 'text' };
      case 7: return {
        ...control,
        type: inputParam.multiSelect ? 'multiselect' : 'select',
        dictCode: inputParam.dictNameCode
      } as Partial<IDynamicFormControl>;
      case 9: return { ...control, type: 'checkbox' };
      case 10: return { ...control, type: 'datetimepicker' };
    }
  }

  parseInputParamControls(controls: { [paramName: string]: any }): IReportParamValue[] {
    return Object.keys(controls)
      .map(paramName => ({
        name: paramName,
        values: (Array.isArray(controls[paramName])
          ? controls[paramName]
          : [ controls[paramName] ]
        ).filter(Boolean).map(v => String(v))
      }));
  }
}

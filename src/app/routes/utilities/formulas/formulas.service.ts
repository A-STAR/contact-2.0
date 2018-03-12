import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IFormula, IFormulaParams, IFormulaResult } from './formulas.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class FormulasService extends AbstractActionService {
  static MESSAGE_FORMULA_SAVED = 'MESSAGE_FORMULA_SAVED';

  private baseUrl = '/formula';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('FORMULA_VIEW');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('FORMULA_EDIT');
  }

  get canCalculate$(): Observable<boolean> {
    return this.userPermissionsService.has('FORMULA_CALCULATE');
  }

  fetchAll(): Observable<Array<IFormula>> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.formulas.gen.plural').dispatchCallback());
  }

  fetch(formulaId: number): Observable<IFormula> {
    return this.dataService.read(`${this.baseUrl}/{formulaId}`, { formulaId })
      .catch(this.notificationsService.fetchError().entity('entities.formulas.gen.singular').dispatchCallback());
  }

  create(formula: IFormula): Observable<IFormula> {
    return this.dataService.create(this.baseUrl, {}, formula)
      .catch(this.notificationsService.createError().entity('entities.formulas.gen.singular').dispatchCallback());
  }

  update(formulaId: number, formula: IFormula): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{formulaId}`, { formulaId }, formula)
      .catch(this.notificationsService.updateError().entity('entities.formulas.gen.singular').dispatchCallback());
  }

  delete(formulaId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{formulaId}`, { formulaId })
      .catch(this.notificationsService.deleteError().entity('entities.formulas.gen.singular').dispatchCallback());
  }

  calculate(formulaId: number, params: IFormulaParams): Observable<IFormulaResult> {
    return this.dataService.create(`${this.baseUrl}/{formulaId}/calculate`, { formulaId }, params)
      .map(response => this.mapResult(response))
      .catch(
        this.notificationsService
          .error('routes.utilities.formulas.errors.calculate')
          .entity('entities.formulas.gen.singular')
          .dispatchCallback()
      );
  }

  private mapResult(response: any): IFormulaResult {
    return {
      success: response.success,
      ...(response.success ? response.data[0] : {})
    };
  }
}

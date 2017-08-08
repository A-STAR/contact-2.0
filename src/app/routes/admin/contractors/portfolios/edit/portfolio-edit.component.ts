import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IPortfolio } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-portfolio-edit',
  templateUrl: './portfolio-edit.component.html'
})
export class PortfolioEditComponent {
  static COMPONENT_NAME = 'ContractorEditComponent';

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IPortfolio = null;

  private contractorId: number;
  private portfolioId: number;

  constructor(
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userDictionariesService: UserDictionariesService,
    private valueConverterService: ValueConverterService,
  ) {
    // TODO(d.maltsev): stronger typing
    const { value } = this.activatedRoute.params as any;
    this.contractorId = value.id;
    this.portfolioId = value.portfolioId;

    if (this.contractorId && this.portfolioId) {
      this.contractorsAndPortfoliosService.fetchPortfolio(this.contractorId, this.portfolioId);
    }

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS),
      this.contractorId && this.portfolioId ?
        this.actions.ofType(ContractorsAndPortfoliosService.PORTFOLIOS_FETCH_SUCCESS).map(action => action.payload.portfolio) :
        Observable.of(null)
    )
    // TODO(d.maltsev): handle errors
    .take(1)
    .subscribe(([ directionOptions, stageOptions, statusOptions, portfolio ]) => {
      this.initFormControls(portfolio, directionOptions, stageOptions, statusOptions);
      this.formData = portfolio ? {
        ...portfolio,
        signDate: this.valueConverterService.fromISO(portfolio.signDate),
        startWorkDate: this.valueConverterService.fromISO(portfolio.startWorkDate),
        endWorkDate: this.valueConverterService.fromISO(portfolio.endWorkDate),
      } : null;
    });

    this.actions.ofType(
      ContractorsAndPortfoliosService.PORTFOLIO_CREATE_SUCCESS,
      ContractorsAndPortfoliosService.PORTFOLIO_UPDATE_SUCCESS
    )
    .take(1)
    .subscribe(() => this.onBack());
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const portfolio = this.getPortfolioFromFormData();
    if (this.contractorId && this.portfolioId) {
      this.contractorsAndPortfoliosService.updatePortfolio(this.contractorId, this.portfolioId, portfolio);
    } else {
      this.contractorsAndPortfoliosService.createPortfolio(this.contractorId, portfolio);
    }
  }

  onBack(): void {
    this.contentTabService.navigate('/admin/contractors');
  }

  private initFormControls(
    portfolio: IPortfolio,
    directionOptions: Array<IOption>,
    stageOptions: Array<IOption>,
    statusOptions: Array<IOption>
  ): void {
    this.controls = [
      { label: 'portfolios.grid.name', controlName: 'name', type: 'text', required: true },
      { label: 'portfolios.grid.directionCode', controlName: 'directionCode', type: 'select', required: true,
          disabled: !!portfolio, options: directionOptions },
      { label: 'portfolios.grid.stageCode', controlName: 'stageCode', type: 'select', required: true, options: stageOptions },
      { label: 'portfolios.grid.statusCode', controlName: 'statusCode', type: 'select', required: true,
          disabled: portfolio && portfolio.directionCode === 2, options: statusOptions },
      { label: 'portfolios.grid.signDate', controlName: 'signDate', type: 'datepicker' },
      { label: 'portfolios.grid.startWorkDate', controlName: 'startWorkDate', type: 'datepicker' },
      { label: 'portfolios.grid.endWorkDate', controlName: 'endWorkDate', type: 'datepicker' },
      { label: 'portfolios.grid.comment', controlName: 'comment', type: 'textarea' },
    ];
  }

  private getPortfolioFromFormData(): IPortfolio {
    const data = this.form.value;
    return {
      ...data,
      directionCode: Array.isArray(data.directionCode) ? data.directionCode[0].value : data.directionCode,
      stageCode: Array.isArray(data.stageCode) ? data.stageCode[0].value : data.stageCode,
      statusCode: Array.isArray(data.statusCode) ? data.statusCode[0].value : data.statusCode,
      signDate: this.valueConverterService.fromLocalDate(data.signDate),
      startWorkDate: this.valueConverterService.fromLocalDate(data.startWorkDate),
      endWorkDate: this.valueConverterService.fromLocalDate(data.endWorkDate)
    };
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IPortfolio } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { makeKey } from '../../../../../core/utils';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

const label = makeKey('portfolios.grid');

@Component({
  selector: 'app-portfolio-edit',
  templateUrl: './portfolio-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioEditComponent {
  static COMPONENT_NAME = 'ContractorEditComponent';

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IPortfolio = null;

  private contractorId: number;
  private portfolioId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userDictionariesService: UserDictionariesService,
    private valueConverterService: ValueConverterService,
  ) {
    const routeParams = (<any>this.route.params).value;
    this.contractorId = routeParams.contractorId;
    this.portfolioId = routeParams.portfolioId;

    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS),
      this.contractorId && this.portfolioId
        ? this.contractorsAndPortfoliosService.readPortfolio(this.contractorId, this.portfolioId)
        : of(null)
    )
    .pipe(first())
    .subscribe(([ directionOptions, stageOptions, statusOptions, portfolio ]) => {
      this.formData = portfolio
        ? {
          ...portfolio,
          signDate: this.valueConverterService.fromISO(portfolio.signDate),
          startWorkDate: this.valueConverterService.fromISO(portfolio.startWorkDate),
          endWorkDate: this.valueConverterService.fromISO(portfolio.endWorkDate),
        }
        : null;

      this.controls = [
        { label: label('name'), controlName: 'name', type: 'text', required: true },
        { label: label('directionCode'), controlName: 'directionCode', type: 'select', required: true,
            disabled: !!portfolio, options: directionOptions },
        { label: label('stageCode'), controlName: 'stageCode', type: 'select',
          // NOTE: must be true, but the dictionary is empty
          required: false, options: stageOptions },
        { label: label('statusCode'), controlName: 'statusCode', type: 'select', required: true,
            disabled: portfolio && portfolio.directionCode === 2, options: statusOptions },
        { label: label('signDate'), controlName: 'signDate', type: 'datepicker' },
        { label: label('startWorkDate'), controlName: 'startWorkDate', type: 'datepicker' },
        { label: label('endWorkDate'), controlName: 'endWorkDate', type: 'datepicker' },
        { label: label('comment'), controlName: 'comment', type: 'textarea' },
      ];
      this.cdRef.markForCheck();
    });
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const portfolio = this.form.serializedUpdates;
    // see requirements
    portfolio.statusCode = portfolio.directionCode === 2 ? null : this.formData.statusCode;
    const action = (this.contractorId && this.portfolioId
      ? this.contractorsAndPortfoliosService.updatePortfolio(this.contractorId, this.portfolioId, portfolio)
      : this.contractorsAndPortfoliosService.createPortfolio(this.contractorId, portfolio));

      action.switchMap(result => this.contractorsAndPortfoliosService.readPortfolios(this.contractorId))
      .subscribe(() => {
        this.onBack();
      });
  }

  onBack(): void {
    this.contentTabService.navigate('/admin/contractors');
  }
}

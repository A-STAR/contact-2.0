import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../../core/state/state.interface';
import { IPortfolio } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from 'app/core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('portfolios.grid');

@Component({
  selector: 'app-portfolio-edit',
  templateUrl: './portfolio-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioEditComponent implements OnInit {
  static COMPONENT_NAME = 'PortfolioEditComponent';

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IPortfolio = null;
  canViewAttributes: boolean;

  private contractorId: number;
  private portfolioId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private store: Store<IAppState>,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
  }

  ngOnInit(): void {
    const routeParams = (<any>this.route.params).value;
    this.contractorId = routeParams.contractorId;
    this.portfolioId = routeParams.portfolioId;

    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS),
      this.contractorId && this.portfolioId
        ? this.contractorsAndPortfoliosService.readPortfolio(this.contractorId, this.portfolioId)
        : of(null),
      this.userPermissionsService.has('ATTRIBUTE_VIEW_LIST')
    )
      .pipe(first())
      // TODO:(i.lobanov) remove canViewAttributes default value when permission will be added on BE
      .subscribe(([directionOptions, stageOptions, statusOptions, portfolio, canViewAttributes]) => {
        this.canViewAttributes = true;
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
          {
            label: label('directionCode'), controlName: 'directionCode', type: 'select', required: true,
            disabled: !!portfolio, options: directionOptions
          },
          {
            label: label('stageCode'), controlName: 'stageCode', type: 'select',
            // NOTE: must be true, but the dictionary is empty
            required: false, options: stageOptions
          },
          {
            label: label('statusCode'), controlName: 'statusCode', type: 'select', required: true,
            disabled: portfolio && portfolio.directionCode === 2, options: statusOptions
          },
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
      .subscribe(portfolios => {
        this.store.dispatch({
          type: ContractorsAndPortfoliosService.PORTFOLIOS_UPDATE,
          payload: { portfolios }
        });
        this.onBack();
      });
  }

  onBack(): void {
    this.router.navigate(['/admin/contractors']);
  }

  onAttributesClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/portfolios/${this.portfolioId}/attributes`]);
  }
}

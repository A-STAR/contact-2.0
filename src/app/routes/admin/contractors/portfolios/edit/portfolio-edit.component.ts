import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import {
  IActionType,
  IPortfolio
} from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';
import { Observable } from 'rxjs/Observable';

const label = makeKey('portfolios.grid');

@Component({
  selector: 'app-portfolio-edit',
  templateUrl: './portfolio-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioEditComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IPortfolio = null;
  canViewAttributes: boolean;

  private contractorId: number;
  private portfolioId: number;
  private selectedEntitiesSub: Subscription;
  private portfolioChangeSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
  }

  ngOnInit(): void {

    const contractorId = Number(this.route.snapshot.paramMap.get('contractorId'));
    const portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
    const getPortfolio$ = portfolioId ? this.contractorsAndPortfoliosService
      .readPortfolio(contractorId, portfolioId).map(result => ({
        portfolio: result,
        contractorId
      })) : Observable.of({ contractorId });

    this.portfolioChangeSub = combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS),
      getPortfolio$,
      this.userPermissionsService.has('ATTRIBUTE_VIEW_LIST')
    )
      // TODO:(i.lobanov) remove canViewAttributes default value when permission will be added on BE
      .subscribe(([directionOptions, stageOptions, statusOptions, action, canViewAttributes]) => {
        this.canViewAttributes = true;

        const editedPortfolio = (action as any).portfolio;
        this.contractorId = action.contractorId;
        this.portfolioId = editedPortfolio && editedPortfolio.id;

        this.formData = editedPortfolio
          ? {
            ...editedPortfolio,
            signDate: this.valueConverterService.fromISO(editedPortfolio.signDate as string),
            startWorkDate: this.valueConverterService.fromISO(editedPortfolio.startWorkDate as string),
            endWorkDate: this.valueConverterService.fromISO(editedPortfolio.endWorkDate as string),
          }
          : null;

        this.controls = [
          { label: label('name'), controlName: 'name', type: 'text', required: true },
          {
            label: label('directionCode'), controlName: 'directionCode', type: 'select', required: true,
            disabled: !!editedPortfolio, options: directionOptions
          },
          {
            label: label('stageCode'), controlName: 'stageCode', type: 'select',
            // NOTE: must be true, but the dictionary is empty
            required: false, options: stageOptions
          },
          {
            label: label('statusCode'), controlName: 'statusCode', type: 'select', required: true,
            disabled: editedPortfolio && editedPortfolio.directionCode === 2, options: statusOptions
          },
          { label: label('signDate'), controlName: 'signDate', type: 'datepicker' },
          { label: label('startWorkDate'), controlName: 'startWorkDate', type: 'datepicker' },
          { label: label('endWorkDate'), controlName: 'endWorkDate', type: 'datepicker' },
          { label: label('comment'), controlName: 'comment', type: 'textarea' },
        ];
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.selectedEntitiesSub) {
      this.selectedEntitiesSub.unsubscribe();
    }
    if (this.portfolioChangeSub) {
      this.portfolioChangeSub.unsubscribe();
    }
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

      action.subscribe(result => {
        if (result) {
          this.contractorsAndPortfoliosService
            .dispatch(IActionType.PORTFOLIO_SAVE);
          this.onBack();
        }
      });
  }

  onBack(): void {
    this.router.navigate(['/admin/contractors']);
  }

  onAttributesClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/portfolios/${this.portfolioId}/attributes`]);
  }
}

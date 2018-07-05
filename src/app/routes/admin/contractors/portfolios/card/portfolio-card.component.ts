import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { EntityType } from '@app/core/entity/entity.interface';
import {
  IActionType,
  IPortfolio
} from '../../contractors-and-portfolios.interface';
import { IDynamicFormControl, IDynamicFormSelectControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IUserTerm } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';
import { IOption } from '@app/core/converter/value-converter.interface';

const label = makeKey('portfolios.grid');

@Component({
  selector: 'app-portfolio-card',
  templateUrl: './portfolio-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioCardComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = null;
  formData: IPortfolio = null;
  canViewAttributes: boolean;
  canViewDocuments: boolean;

  private contractorId: number;
  private portfolioId: number;
  private selectedEntitiesSub: Subscription;
  private portfolioChangeSub: Subscription;
  private portfolioTypeTerms: IUserTerm[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService
  ) {
  }

  ngOnInit(): void {

    const contractorId = Number(this.route.snapshot.paramMap.get('contractorId'));
    const portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
    const getPortfolio$ = portfolioId
      ? this.contractorsAndPortfoliosService
          .readPortfolio(contractorId, portfolioId).map(result => ({
            portfolio: result,
            contractorId
          }))
      : of({ contractorId });

    this.portfolioChangeSub = combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS),
      this.userDictionariesService.getDictionary(UserDictionariesService.DICTIONARY_PORTFOLIO_TYPE),
      getPortfolio$,
      this.userPermissionsService.contains('ATTRIBUTE_VIEW_LIST', EntityType.PORTFOLIO),
      this.userPermissionsService.contains('FILE_ATTACHMENT_VIEW_LIST', EntityType.PORTFOLIO),
    )
    .subscribe(([
      directionOptions,
      stageOptions,
      statusOptions,
      typeTerms,
      action,
      canViewAttributes,
      canViewDocuments,
    ]) => {

      const editedPortfolio = (action as any).portfolio;
      this.canViewAttributes = canViewAttributes && editedPortfolio;
      this.canViewDocuments = canViewDocuments && editedPortfolio;
      this.contractorId = action.contractorId;
      this.portfolioId = editedPortfolio && editedPortfolio.id;
      this.portfolioTypeTerms = typeTerms;

      this.formData = editedPortfolio
        ? {
          ...editedPortfolio,
          signDate: this.valueConverterService.fromISO(editedPortfolio.signDate as string),
          startWorkDate: this.valueConverterService.fromISO(editedPortfolio.startWorkDate as string),
          endWorkDate: this.valueConverterService.fromISO(editedPortfolio.endWorkDate as string),
        }
        : { directionCode: 1 };

      this.controls = [
        { label: label('name'), controlName: 'name', type: 'text', required: true },
        {
          label: label('directionCode'), controlName: 'directionCode', type: 'select', required: true,
          disabled: !!editedPortfolio, options: directionOptions,
          onChange: directionCode => this.onDirectionCodeChange(directionCode)
        },
        {
          label: label('stageCode'), controlName: 'stageCode', type: 'select',
          options: stageOptions
        },
        {
          label: label('statusCode'), controlName: 'statusCode', type: 'select', required: true,
          disabled: editedPortfolio && editedPortfolio.directionCode === 2, options: statusOptions
        },
        {
          label: label('typeCode'), controlName: 'typeCode', type: 'select',
          options: this.getPortfolioTypeOptions(this.formData.directionCode)
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
    const payload = {
      ...portfolio,
      statusCode: portfolio.directionCode === 2 ? null : portfolio.statusCode,
    };
    const action = (this.contractorId && this.portfolioId
      ? this.contractorsAndPortfoliosService.updatePortfolio(this.contractorId, this.portfolioId, payload)
      : this.contractorsAndPortfoliosService.createPortfolio(this.contractorId, payload));

      action.subscribe(result => {
        if (result) {
          this.contractorsAndPortfoliosService
            .dispatch(IActionType.PORTFOLIO_SAVE);
          this.onBackAfterSave();
        }
      });
  }

  onBack(): void {
    this.onBackAfterSave();
    this.contractorsAndPortfoliosService
      .dispatch(IActionType.PORTFOLIO_BACK);
  }

  onBackAfterSave(): void {
    this.routingService.navigate([ '/app/admin/contractors' ]);
  }

  onAttributesClick(): void {
    this.routingService.navigate([ 'attributes' ], this.route);
  }

  onDocumentsClick(): void {
    this.routingService.navigate(['documents'], this.route);
  }

  onDirectionCodeChange(code: number): any {
    const typeControl = this.controls.find(c => c.controlName === 'typeCode') as IDynamicFormSelectControl;
    const statusControl = this.form.getControl('statusCode');

    this.controls.find(c => c.controlName === 'statusCode').required = code !== 2;

    if (statusControl) {
      statusControl[code === 2 ? 'disable' : 'enable']();
    }

    if (typeControl) {
      const typeOptions = this.getPortfolioTypeOptions(code);
      typeControl.options = typeOptions;
    }

    this.cdRef.markForCheck();
  }

  private getPortfolioTypeOptions(code: number): IOption[] {
    return this.portfolioTypeTerms
      .filter(t => t.parentCode === code)
      .map(term => ({ value: term.code, label: term.name, isClosed: term.isClosed }));

  }
}

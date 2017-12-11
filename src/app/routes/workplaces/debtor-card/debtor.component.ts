import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { IDynamicFormItem } from '../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { INavigationParams } from '../../../core/app-modules/debtor-card/debtor-card.interface';
import { IPerson } from './debtor.interface';
import { IDebt } from '../debt-processing/debt-processing.interface';

import { DebtService } from '../../../core/debt/debt.service';
import { DebtorCardService } from '../../../core/app-modules/debtor-card/debtor-card.service';
import { DebtorService } from './debtor.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../core/converter/value-converter.service';

import { DebtorInformationComponent } from './information/information.component';
import { DynamicFormComponent } from '../../../shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '../../../core/dialog';
import { first } from 'rxjs/operators/first';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss'],
})
export class DebtorComponent extends DialogFunctions implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'DebtorComponent';

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(DebtorInformationComponent) information: DebtorInformationComponent;

  controls: IDynamicFormItem[];
  dialog: 'registerContact' = null;
  // nice, isn't it?
  tabs = [
    { isInitialised: true },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
  ];

  private personSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private debtorCardService: DebtorCardService,
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.personSubscription = this.userPermissionsService.has('PERSON_INFO_EDIT')
      .pipe(first())
      .subscribe(canEdit => {
        this.controls = this.buildControls(canEdit);
        this.cdRef.markForCheck();
      });

    this.debtorCardService.initByDebtId(this.debtId);
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  get data$(): Observable<Partial<IDebt & IPerson>> {
    return Observable.combineLatest(
      this.debtorCardService.person$,
      this.debtorCardService.selectedDebt$,
    )
    .map(([person, debt]) => ({
      ...person,
      responsibleFullName: debt.responsibleFullName,
      utc: debt.utc,
      shortInfo: debt.shortInfo,
    }));
  }

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get personId$(): Observable<number> {
    return this.debtorCardService.personId$;
  }

  get isCompany$(): Observable<boolean> {
    return this.debtorCardService.isCompany$;
  }

  get canSubmit(): boolean {
    return this.form && this.information.form && (this.form.canSubmit || this.information.form.canSubmit);
  }

  get isContactRegistrationDisabled$(): Observable<boolean> {
    return this.debtorCardService.selectedDebt$.flatMap(debt => this.debtService.canRegisterContactForDebt$(debt));
  }

  onSubmit(): void {
    const value = {
      ...this.form.serializedUpdates,
      ...this.information.form.serializedUpdates,
    };

    this.personId$
      .flatMap(personId => this.debtorService.update(personId, value))
      .pipe(first())
      .subscribe(() => {
        this.form.form.markAsPristine();
        this.information.form.form.markAsPristine();
        this.cdRef.markForCheck();
      });
  }

  onRegisterContactClick(): void {
    this.setDialog('registerContact');
    this.cdRef.markForCheck();
  }

  onRegisterContactDialogSubmit({ contactType, contactId }: any): void {
    this.personId$
      .pipe(first())
      .subscribe(personId => {
        this.setDialog();
        this.debtService.navigateToRegistration({
          contactId,
          contactType,
          debtId: this.debtId,
          personId,
          personRole: 1,
        });
      });
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  private buildControls(canEdit: boolean): IDynamicFormItem[] {
    const debtorTypeOptions = {
      type: 'selectwrapper',
      dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE
    };
    const stageCodeOptions = {
      type: 'selectwrapper',
      dictCode: UserDictionariesService.DICTIONARY_DEBTOR_STAGE_CODE
    };
    return [
      {
        children: [
          { width: 1, label: 'debtor.id', controlName: 'id', type: 'number', disabled: true },
          { width: 2, label: 'debtor.lastName', controlName: 'lastName', type: 'text', disabled: !canEdit, required: true },
          { width: 2, label: 'debtor.firstName', controlName: 'firstName', type: 'text', disabled: !canEdit },
          { width: 2, label: 'debtor.middleName', controlName: 'middleName', type: 'text', disabled: !canEdit },
          { width: 1, label: 'debtor.type', controlName: 'typeCode', ...debtorTypeOptions, disabled: true },
          { width: 2, label: 'debtor.stageCode', controlName: 'stageCode', ...stageCodeOptions, disabled: !canEdit },
          { width: 2, label: 'debtor.responsibleFullName', controlName: 'responsibleFullName', type: 'text', disabled: true },
          { width: 12, label: 'debtor.shortInfo', controlName: 'shortInfo', type: 'textarea', disabled: true },
        ]
      }
    ] as IDynamicFormItem[];
  }

  private get debtId(): number {
    return this.routeParams.debtId;
  }

  private get routeParams(): INavigationParams {
    return (this.route.params as BehaviorSubject<INavigationParams>).value;
  }
}

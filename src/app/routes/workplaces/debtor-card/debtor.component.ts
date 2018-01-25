import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators/first';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormItem } from '../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPerson } from './debtor.interface';
import { IDebt } from '../debt-processing/debt-processing.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtService } from '../../../core/debt/debt.service';
import { DebtorCardService } from '../../../core/app-modules/debtor-card/debtor-card.service';
import { DebtorService } from './debtor.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

import { DebtorInformationComponent } from './information/information.component';
import { DynamicFormComponent } from '../../../shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '../../../core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-height' },
  providers: [
    ContactRegistrationService,
  ],
  selector: 'app-debtor',
  styleUrls: ['./debtor.component.scss'],
  templateUrl: './debtor.component.html',
})
export class DebtorComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(DebtorInformationComponent) information: DebtorInformationComponent;

  controls: IDynamicFormItem[];
  data: Partial<IDebt & IPerson>;
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
    private contactRegistrationService: ContactRegistrationService,
    private debtService: DebtService,
    private debtorCardService: DebtorCardService,
    private debtorService: DebtorService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userPermissionsService.has('PERSON_INFO_EDIT')
      .pipe(first())
      .subscribe(canEdit => {
        this.controls = this.buildControls(canEdit);
        this.cdRef.markForCheck();
      });

    this.personSubscription = combineLatest(
      this.debtorCardService.person$.filter(Boolean),
      this.debtorCardService.selectedDebt$.filter(Boolean),
    )
    .map(([person, debt]) => ({
      ...person,
      responsibleFullName: debt.responsibleFullName,
      utc: debt.utc,
      shortInfo: debt.shortInfo,
    }))
    .distinctUntilChanged()
    .subscribe(data => {
      this.data = data;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  get displayContactRegistration$(): Observable<boolean> {
    return this.contactRegistrationService.isActive$;
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
    combineLatest(this.personId$, this.debtId$)
      .pipe(first())
      .subscribe(([ personId, debtId ]) => {
        this.setDialog();
        this.contactRegistrationService.params = {
          contactId,
          contactType,
          debtId,
          personId,
          personRole: 1,
        };
      });
  }

  onTabSelect(tabIndex: number): void {
    if (Number.isInteger(tabIndex)) {
      this.tabs[tabIndex].isInitialised = true;
    }
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
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, mergeMap, map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployment } from '@app/routes/workplaces/core/employment/employment.interface';
import { IPerson } from '../debtor.interface';
import { IDebt } from '../../debt-processing/debt-processing.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtService } from '@app/core/debt/debt.service';
import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { DebtorService } from '../debtor.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DebtorInformationComponent } from '../information/information.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '@app/core/dialog';
import { invert } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-size' },
  selector: 'app-debtor',
  templateUrl: './debtor-card-layout.component.html',
})
export class DebtorCardLayoutComponent extends DialogFunctions implements AfterViewInit, OnDestroy {
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
  private routeIdSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private debtService: DebtService,
    private debtorCardService: DebtorCardService,
    private debtorService: DebtorService,
    private userPermissionsService: UserPermissionsService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.userPermissionsService.has('PERSON_INFO_EDIT')
      .pipe(first())
      .subscribe(canEdit => {
        this.controls = this.buildControls(canEdit);
        this.cdRef.markForCheck();
      });

    this.routeIdSubscription = this.route.paramMap
      .subscribe(paramMap => {
        const debtId = paramMap.get('debtId');
        if (debtId) {
          this.debtorCardService.initByDebtId(Number(debtId));
        }
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
      })
    )
    .distinctUntilChanged()
    .subscribe(data => {
      this.data = data;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
    this.routeIdSubscription.unsubscribe();
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
    const mainForm = this.form;
    const infoForm = this.information && this.information.form;
    // Both forms have to be valid
    const isValid = (mainForm && mainForm.isValid) && (infoForm && infoForm.isValid);
    // Only one form has to be dirty
    const isDirty = (mainForm && mainForm.isDirty) || (infoForm && infoForm.isDirty);
    return isValid && isDirty;
  }

  get isContactRegistrationDisabled$(): Observable<boolean> {
    return this.debtorCardService.selectedDebt$
      .pipe(
        mergeMap(debt => this.debtService.canRegisterContactForDebt$(debt)),
        map(invert),
      );
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
        this.contactRegistrationService.startRegistration({
          contactId,
          contactType,
          debtId,
          personId,
          personRole: 1,
        });
      });
  }

  onTabSelect(tabIndex: number): void {
    if (Number.isInteger(tabIndex)) {
      this.tabs[tabIndex].isInitialised = true;
    }
  }

  onIdentityAdd(): void {
    this.routingService.navigate([ 'identity/create' ], this.route);
  }

  onIdentityEdit(doc: IIdentityDoc): void {
    this.routingService.navigate([ `identity/${doc.id}` ], this.route);
  }

  onEmploymentAdd(): void {
    this.routingService.navigate([ 'employment/create' ], this.route);
  }

  onEmploymentEdit(employment: IEmployment): void {
    this.routingService.navigate([ `employment/${employment.id}` ], this.route);
  }

  private buildControls(canEdit: boolean): IDynamicFormItem[] {
    const debtorTypeOptions = {
      type: 'select',
      dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE
    };
    const stageCodeOptions = {
      type: 'select',
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

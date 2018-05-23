import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first, mergeMap, map } from 'rxjs/operators';
import { equals } from 'ramda';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployment } from '@app/routes/workplaces/core/employment/employment.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtorService } from '../debtor.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DebtorInformationComponent } from '../information/information.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '@app/core/dialog';
import { invert } from '@app/core/utils';

import { Debt, Person } from '@app/entities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-size' },
  selector: 'app-debtor-card-layout',
  templateUrl: './debtor-card-layout.component.html',
})
export class DebtorCardLayoutComponent extends DialogFunctions implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(DebtorInformationComponent) information: DebtorInformationComponent;

  controls: IDynamicFormItem[];
  data: Partial<Debt & Person>;
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
  debtorId: number;
  debtId: number;

  private debtSub: Subscription;
  private debtorSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private debtorService: DebtorService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) {
    super();
  }

  ngOnInit(): void {

    this.debtorId = Number(this.route.snapshot.paramMap.get('debtorId'));
    this.debtId = Number(this.route.snapshot.paramMap.get('debtId'));

    this.debtorService.debtor$
      .distinctUntilChanged((a, b) => a && b && equals(a, b))
      .subscribe(person => {
        this.data = {
          ...this.data,
          ...person,
        };
        this.cdRef.markForCheck();
      });

    this.debtSub = this.debtorService.debt$
      .distinctUntilChanged((a, b) => a && b && equals(a, b))
      .subscribe(debt => {
        this.data = {
          ...this.data,
          ...(
            {
              responsibleFullName: debt.responsibleFullName,
              utc: debt.utc,
              shortInfo: debt.shortInfo,
            }
          ),
        };
        this.cdRef.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    this.userPermissionsService.has('PERSON_INFO_EDIT')
      .pipe(first())
      .subscribe(canEdit => {
        this.controls = this.buildControls(canEdit);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.debtSub) {
      this.debtSub.unsubscribe();
    }
    if (this.debtorSub) {
      this.debtorSub.unsubscribe();
    }
  }

  readonly isCompany$: Observable<boolean> = this.debtorService.isCompany$;

  get canSubmit(): boolean {
    const mainForm = this.form;
    const infoForm = this.information && this.information.form;
    // Both forms have to be valid
    const isValid = (mainForm && mainForm.isValid) && (infoForm && infoForm.isValid);
    // Only one form has to be dirty
    const isDirty = (mainForm && mainForm.isDirty) || (infoForm && infoForm.isDirty);
    return isValid && isDirty;
  }

 readonly isContactRegistrationDisabled$: Observable<boolean> = this.debtorService.debt$
    .pipe(
      mergeMap(debt => this.debtorService.canRegisterContactForDebt$(debt)),
      map(invert),
    );

  onSubmit(): void {
    if (this.canSubmit) {
      const value = {
        ...this.form.serializedUpdates,
        ...this.information.form.serializedUpdates,
      };

      this.debtorService.updateDebtor(value)
        .pipe(first())
        .subscribe(() => {
          this.form.form.markAsPristine();
          this.information.form.form.markAsPristine();
          this.notificationsService.info('debtor.successUpdate')
            .params({ id: this.debtId.toString() })
            .dispatch();
          this.cdRef.markForCheck();
        });
    }
  }

  onRegisterContactClick(): void {
    this.setDialog('registerContact');
    this.cdRef.markForCheck();
  }

  onRegisterContactDialogSubmit({ contactType, contactId }: any): void {
    this.setDialog();
      this.contactRegistrationService.startRegistration({
        contactId,
        contactType,
        debtId: this.debtId,
        personId: this.debtorId,
        personRole: 1,
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

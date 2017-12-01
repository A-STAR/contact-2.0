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
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { IDynamicFormItem } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPerson } from './debtor.interface';
import { IDebt } from '../debt-processing.interface';

import { DebtorService } from './debtor.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { DebtorInformationComponent } from './information/information.component';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '../../../../core/dialog';

import { invert } from '../../../../core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss'],
  providers: [
    DebtorService,
  ]
})
export class DebtorComponent extends DialogFunctions implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'DebtorComponent';

  @ViewChild('form') form: DynamicFormComponent;
  @ViewChild('information') information: DebtorInformationComponent;

  person: Partial<IPerson & IDebt>;
  controls: IDynamicFormItem[];
  dialog: 'registerContact' = null;

  private personSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private translate: TranslateService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.personSubscription = Observable.combineLatest(
      this.userPermissionsService.has('PERSON_INFO_EDIT'),
      this.debtorService.debtor$,
      this.debtorService.debt$,
    )
    .subscribe(([ canEdit, person, debt ]) => {
      this.person = {
        ...person,
        birthDate: this.valueConverterService.fromISO(person.birthDate as string),
        responsibleFullName: debt.responsibleFullName || this.translate.instant('default.NA'),
        utc: debt.utc,
        shortInfo: debt.shortInfo,
      };
      this.controls = this.getControls(canEdit);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  get debtId$(): Observable<number> {
    return this.debtorService.debt$.map(debt => debt.id);
  }

  get personId$(): Observable<number> {
    return this.debtorService.debtor$.map(debtor => debtor.id);
  }

  get isCompany$(): Observable<boolean> {
    return this.debtorService.isCompany$;
  }

  get canSubmit(): boolean {
    return this.form && this.information.form && (this.form.canSubmit || this.information.form.canSubmit);
  }

  get isContactRegistrationDisabled$(): Observable<boolean> {
    return this.debtorService.canRegisterDebt$.map(invert);
  }

  onSubmit(): void {
    const value = {
      ...this.form.serializedUpdates,
      ...this.information.form.serializedUpdates,
    };

    this.debtorService.update(value).subscribe(() => {
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
    this.setDialog();
    this.debtorService.navigateToRegistration({ personId: this.person.id, personRole: 1, contactType, contactId });
  }

  private getControls(canEdit: boolean): IDynamicFormItem[] {
    const debtorTypeOptions = {
      type: 'selectwrapper',
      dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE
    };
    return [
      {
        children: [
          { width: 1, label: 'debtor.id', controlName: 'id', type: 'number', disabled: true },
          { width: 3, label: 'debtor.lastName', controlName: 'lastName', type: 'text', disabled: !canEdit, required: true },
          { width: 2, label: 'debtor.firstName', controlName: 'firstName', type: 'text', disabled: !canEdit },
          { width: 2, label: 'debtor.middleName', controlName: 'middleName', type: 'text', disabled: !canEdit },
          { width: 2, label: 'debtor.type', controlName: 'typeCode', ...debtorTypeOptions, disabled: true },
          { width: 2, label: 'debtor.responsibleFullName', controlName: 'responsibleFullName', type: 'text', disabled: true },
          { width: 12, label: 'debtor.shortInfo', controlName: 'shortInfo', type: 'textarea', disabled: true },
        ]
      }
    ] as IDynamicFormItem[];
  }
}

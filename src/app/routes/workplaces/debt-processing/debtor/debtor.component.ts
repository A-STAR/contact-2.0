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

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPerson } from './debtor.interface';
import { IDebt } from '../debt-processing.interface';

import { DebtorService } from './debtor.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { DebtorInformationComponent } from './information/information.component';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

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
export class DebtorComponent implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'DebtorComponent';

  @ViewChild('form') form: DynamicFormComponent;
  @ViewChild('information') information: DebtorInformationComponent;

  person: Partial<IPerson & IDebt>;
  controls: IDynamicFormControl[];

  private personSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private translate: TranslateService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {}

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

  get canSubmit(): boolean {
    return this.form && this.information.form && (this.form.canSubmit || this.information.form.canSubmit);
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

  private getControls(canEdit: boolean): IDynamicFormControl[] {
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
    ] as IDynamicFormControl[];
  }
}

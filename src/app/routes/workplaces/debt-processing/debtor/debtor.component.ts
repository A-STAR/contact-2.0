import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormGroup } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';
import { IPerson } from './debtor.interface';

import { DebtorService } from './debtor.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { DebtorInformationComponent } from './general/information.component';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss'],
})
export class DebtorComponent implements OnDestroy {
  static COMPONENT_NAME = 'DebtorComponent';

  @ViewChild('form') form: DynamicFormComponent;
  @ViewChild('information') information: DebtorInformationComponent;

  person: IPerson;
  controls: Array<IDynamicFormGroup>;

  private personId = (this.route.params as any).value.id || null;
  private personSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    this.personSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.userPermissionsService.has('PERSON_INFO_EDIT'),
      this.debtorService.fetch(this.personId)
    )
    .subscribe(([ personTypeOptions, canEdit, person ]) => {
      this.person = {
        ...person,
        birthDate: this.valueConverterService.fromISO(person.birthDate as string)
      };
      this.controls = this.getControls(canEdit, personTypeOptions);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    const formGeneral = this.form && this.form.form;
    const formInformation = this.information.form && this.information.form.form;
    return formGeneral && formInformation && formGeneral.valid && formInformation.valid && (formGeneral.dirty || formInformation.dirty);
  }

  onSubmit(): void {
    const value = {
      ...this.form.requestValue,
      ...this.information.form.requestValue,
    }

    this.debtorService.update(this.personId, value).subscribe(() => {
      this.form.form.markAsPristine();
      this.information.form.form.markAsPristine();
      this.cdRef.markForCheck();
    });
  }

  private getControls(canEdit: boolean, personTypeOptions: Array<IOption>): Array<IDynamicFormGroup> {
    return [
      {
        children: [
          { width: 1, label: 'debtor.id', controlName: 'id', type: 'number', disabled: true },
          { width: 3, label: 'debtor.lastName', controlName: 'lastName', type: 'text', disabled: !canEdit, required: true },
          { width: 2, label: 'debtor.firstName', controlName: 'firstName', type: 'text', disabled: !canEdit },
          { width: 2, label: 'debtor.middleName', controlName: 'middleName', type: 'text', disabled: !canEdit },
          { width: 2, label: 'debtor.type', controlName: 'typeCode', type: 'select', options: personTypeOptions, disabled: true },
          { width: 2, label: 'debtor.responsible', controlName: 'responsible', type: 'text', disabled: true },
        ]
      }
    ];
  }
}

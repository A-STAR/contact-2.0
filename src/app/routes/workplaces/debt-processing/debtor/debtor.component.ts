import { Component, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormGroup } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';
import { IPerson } from './debtor.interface';

import { DebtorService } from './debtor.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserDictionaries2Service } from '../../../../core/user/dictionaries/user-dictionaries-2.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss'],
})
export class DebtorComponent implements OnDestroy {
  static COMPONENT_NAME = 'DebtorComponent';

  person: IPerson;
  controls: Array<IDynamicFormGroup>;

  private personId = (this.route.params as any).value.id || null;
  private personSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private userDictionariesService: UserDictionaries2Service,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.personSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.userPermissionsService.has('PERSON_INFO_EDIT'),
      this.debtorService.fetch(this.personId)
    )
    .subscribe(([ personTypeOptions, canEdit, person ]) => {
      this.person = person;
      this.controls = this.getControls(canEdit, personTypeOptions);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  protected getControls(canEdit: boolean, personTypeOptions: Array<IOption>): Array<IDynamicFormGroup> {
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

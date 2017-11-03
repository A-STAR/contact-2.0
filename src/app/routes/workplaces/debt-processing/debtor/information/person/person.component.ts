import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormItem } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPerson } from '../../debtor.interface';
import { IUserConstant } from '../../../../../../core/user/constants/user-constants.interface';

import { DebtorService } from '../../debtor.service';
import { UserConstantsService } from '../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { range } from '../../../../../../core/utils';

@Component({
  selector: 'app-debtor-information-person',
  templateUrl: 'person.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];

  private personSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.personSubscription = Observable.combineLatest(
      this.userPermissionsService.has('PERSON_INFO_EDIT'),
      this.userPermissionsService.has('PERSON_COMMENT_EDIT'),
      this.userConstantsService.get('Person.Individual.AdditionalAttribute.List'),
    )
    .subscribe(([ canEdit, canEditComment, stringValues ]) => {
      this.controls = this.getControls(canEdit, canEditComment, stringValues);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  get debtor$(): Observable<IPerson> {
    return this.debtorService.debtor$;
  }

  protected getControls(canEdit: boolean, canEditComment: boolean, stringValues: IUserConstant): IDynamicFormItem[] {
    const displayedStringValues = stringValues.valueS.split(',').map(Number);
    return [
      {
        label: 'person.gender',
        controlName: 'genderCode',
        type: 'selectwrapper',
        dictCode: UserDictionariesService.DICTIONARY_GENDER,
        disabled: !canEdit,
        width: 2,
      },
      {
        label: 'person.birthDate',
        controlName: 'birthDate',
        type: 'datepicker',
        disabled: !canEdit,
        width: 2,
      },
      {
        label: 'person.birthPlace',
        controlName: 'birthPlace',
        type: 'text',
        disabled: !canEdit,
        width: 2,
      },
      {
        label: 'person.familyStatusCode',
        controlName: 'familyStatusCode',
        type: 'selectwrapper',
        dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
        disabled: !canEdit,
        width: 3,
      },
      {
        label: 'person.educationCode',
        controlName: 'educationCode',
        type: 'selectwrapper',
        dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
        disabled: !canEdit,
        width: 3,
      },
      ...range(1, 10).map(i => ({
        label: `person.stringValue${i}`,
        controlName: `stringValue${i}`,
        type: 'text',
        width: 3,
        display: displayedStringValues.includes(i),
      }) as IDynamicFormItem),
      {
        label: 'person.comment',
        controlName: 'comment',
        type: 'textarea',
        disabled: !canEditComment,
        width: 12,
      },
    ];
  }
}

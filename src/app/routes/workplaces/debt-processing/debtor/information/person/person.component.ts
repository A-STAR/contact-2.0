import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormGroup } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPerson } from '../../debtor.interface';

import { DebtorService } from '../../debtor.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debtor-information-person',
  templateUrl: 'person.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormGroup[];

  private personSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.personSubscription = Observable.combineLatest(
      this.userPermissionsService.has('PERSON_INFO_EDIT'),
      this.userPermissionsService.has('PERSON_COMMENT_EDIT'),
    )
    .subscribe(([ canEdit, canEditComment ]) => {
      this.controls = this.getControls(canEdit, canEditComment);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  get debtor$(): Observable<IPerson> {
    return this.debtorService.debtor$;
  }

  protected getControls(canEdit: boolean, canEditComment: boolean): IDynamicFormGroup[] {
    return [
      {
        title: 'debtor.information.title',
        children: [
          {
            width: 6,
            children: [
              {
                label: 'person.gender',
                controlName: 'genderCode',
                type: 'selectwrapper',
                dictCode: UserDictionariesService.DICTIONARY_GENDER,
                disabled: !canEdit
              },
              {
                label: 'person.birthDate',
                controlName: 'birthDate',
                type: 'datepicker',
                disabled: !canEdit
              },
              {
                label: 'person.birthPlace',
                controlName: 'birthPlace',
                type: 'text',
                disabled: !canEdit
              },
            ]
          },
          {
            width: 6,
            children: [
              {
                label: 'person.familyStatusCode',
                controlName: 'familyStatusCode',
                type: 'selectwrapper',
                dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
                disabled: !canEdit
              },
              {
                label: 'person.educationCode',
                controlName: 'educationCode',
                type: 'selectwrapper',
                dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
                disabled: !canEdit
              },
              {
                label: 'person.comment',
                controlName: 'comment',
                type: 'textarea',
                disabled: !canEditComment
              },
            ]
          }
        ]
      },
    ];
  }
}

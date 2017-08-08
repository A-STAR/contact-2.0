import { ChangeDetectorRef, Component, ChangeDetectionStrategy, Input, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormGroup } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { INode } from '../../../../../shared/gui-objects/container/container.interface';
import { IPerson } from '../debtor.interface';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { AddressGridComponent } from '../../../../../shared/gui-objects/widgets/address/grid/address-grid.component';
import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { EmailGridComponent } from '../../../../../shared/gui-objects/widgets/email/grid/email-grid.component';
import { PhoneGridComponent } from '../../../../../shared/gui-objects/widgets/phone/grid/phone-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-information',
  templateUrl: './information.component.html',
})
export class DebtorInformationComponent implements OnDestroy {
  @Input() person: IPerson;

  @ViewChild('form') form: DynamicFormComponent;

  node: INode = {
    container: 'tabs',
    children: [
      { component: AddressGridComponent, title: 'debtor.information.address.title' },
      { component: PhoneGridComponent, title: 'debtor.information.phone.title' },
      { component: EmailGridComponent, title: 'debtor.information.email.title' },
    ]
  };

  controls: Array<IDynamicFormGroup>;

  private personSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.personSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_GENDER,
        UserDictionariesService.DICTIONARY_MARITAL_STATUS,
        UserDictionariesService.DICTIONARY_EDUCATION,
      ]),
      this.userPermissionsService.has('PERSON_INFO_EDIT'),
      this.userPermissionsService.has('PERSON_COMMENT_EDIT'),
    )
    .subscribe(([ options, canEdit, canEditComment ]) => {
      this.controls = this.getControls(options, canEdit, canEditComment);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  protected getControls(options: { [key: number]: Array<IOption> }, canEdit: boolean, canEditComment: boolean): IDynamicFormGroup[] {
    const genderOptions        = options[UserDictionariesService.DICTIONARY_GENDER];
    const maritalStatusOptions = options[UserDictionariesService.DICTIONARY_MARITAL_STATUS];
    const educationOptions     = options[UserDictionariesService.DICTIONARY_EDUCATION];
    return [
      {
        title: 'debtor.information.title',
        children: [
          {
            width: 6,
            children: [
              { label: 'person.gender', controlName: 'genderCode', type: 'select', options: genderOptions, disabled: !canEdit },
              { label: 'person.birthDate', controlName: 'birthDate', type: 'datepicker', disabled: !canEdit },
              { label: 'person.birthPlace', controlName: 'birthPlace', type: 'text', disabled: !canEdit },
            ]
          },
          {
            width: 6,
            children: [
              { label: 'person.familyStatusCode', controlName: 'familyStatusCode', type: 'select', options: maritalStatusOptions,
                  disabled: !canEdit },
              { label: 'person.educationCode', controlName: 'educationCode', type: 'select', options: educationOptions,
                  disabled: !canEdit },
              { label: 'person.comment', controlName: 'comment', type: 'textarea', disabled: !canEditComment },
            ]
          }
        ]
      },
    ];
  }
}

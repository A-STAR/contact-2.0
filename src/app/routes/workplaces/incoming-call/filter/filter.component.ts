import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { IncomingCallService } from '../incoming-call.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { addLabel } from '../../../../core/utils';

@Component({
  selector: 'app-incoming-call-filter',
  templateUrl: 'filter.component.html',
  styleUrls: [ 'filter.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { controlName: 'debtId', type: 'text' },
    { controlName: 'fullName', type: 'text' },
    { controlName: 'contract', type: 'text' },
    { controlName: 'phoneNumber', type: 'text' },
    { controlName: 'fullAddress', type: 'text' },
    { controlName: 'docNumber', type: 'text' },
    { controlName: 'birthDate', type: 'datepicker' },
    { controlName: 'personRoleCodes', type: 'multiselect', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { controlName: 'showClosed', type: 'checkbox' },
  ].map(addLabel('modules.incomingCall.filter.form'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private incomingCallService: IncomingCallService,
  ) {}

  onSearchClick(): void {
    this.incomingCallService.searchParams = this.form.serializedUpdates;
  }

  onClearClick(): void {
    this.incomingCallService.searchParams = null;
    this.form.reset();
    this.form.markAsPristine();
    this.cdRef.markForCheck();
  }
}

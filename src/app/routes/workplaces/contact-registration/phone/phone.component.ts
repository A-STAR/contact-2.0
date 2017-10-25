import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { PhoneService } from './phone.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.phone');

@Component({
  selector: 'app-contact-registration-phone',
  templateUrl: './phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneComponent {
  @Input() debtId: number;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls = [
    { controlName: 'typeCode', type: 'selectwrapper', dictCode: 17 },
    { controlName: 'phone', type: 'text' },
    { controlName: 'stopAutoSms', type: 'checkbox' },
    { controlName: 'stopAutoInfo', type: 'checkbox' },
    { controlName: 'comment', type: 'textarea' },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private phoneService: PhoneService,
  ) {}

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    const data = this.form.getSerializedUpdates();
    this.phoneService.create(this.debtId, guid, data)
      .subscribe(() => {
        this.contactRegistrationService.nextStep();
        this.cdRef.markForCheck();
      });
  }
}

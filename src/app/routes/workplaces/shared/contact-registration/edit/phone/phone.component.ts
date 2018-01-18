import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { AccordionService } from '@app/shared/components/accordion/accordion.service';
import { ContactRegistrationService } from '../../contact-registration.service';
import { PhoneService } from './phone.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { ContactSelectComponent } from '../contact-select/contact-select.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const labelKey = makeKey('modules.contactRegistration.phone');

@Component({
  selector: 'app-contact-registration-phone',
  templateUrl: './phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneComponent {
  @Input() debtId: number;
  @Input() personId: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(ContactSelectComponent) select: ContactSelectComponent;

  controls = [
    { controlName: 'typeCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_PHONE_TYPE, required: true },
    { controlName: 'phone', type: 'text', required: true },
    { controlName: 'stopAutoSms', type: 'checkbox' },
    { controlName: 'stopAutoInfo', type: 'checkbox' },
    { controlName: 'comment', type: 'textarea' },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};

  constructor(
    private accordionService: AccordionService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private phoneService: PhoneService,
  ) {}

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit && this.select.isValid;
  }

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    const data = {
      ...this.form.serializedUpdates,
      person: this.select.person,
    };
    this.phoneService.create(this.debtId, guid, data)
      .subscribe(() => {
        this.accordionService.next();
        this.cdRef.markForCheck();
      });
  }
}

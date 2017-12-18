import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { AccordionService } from '../../../../shared/components/accordion/accordion.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { PhoneService } from './phone.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../core/utils';
import { ContactGridComponent } from '../contact/contact-grid.component';

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
  @ViewChild(ContactGridComponent) grid: ContactGridComponent;

  controls = [
    { controlName: 'typeCode', type: 'selectwrapper', dictCode: 17, required: true },
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
    return this.form && this.form.canSubmit && this.grid && !!this.grid.selectedPerson;
  }

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    const { id, personId, personFullName, personRole, ...person } = this.grid.selectedPerson;
    const data = {
      ...this.form.serializedUpdates,
      person: personId ? { personId } : person,
    };
    this.phoneService.create(this.debtId, guid, data)
      .subscribe(() => {
        this.accordionService.next();
        this.cdRef.markForCheck();
      });
  }
}

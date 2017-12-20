import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { AccordionService } from '../../../../shared/components/accordion/accordion.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { ContactService } from './contact.service';

import { ContactSelectComponent } from '../contact-select/contact-select.component';

@Component({
  selector: 'app-contact-registration-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  @Input() debtId: number;
  @Input() personId: number;

  @ViewChild(ContactSelectComponent) select: ContactSelectComponent;

  constructor(
    private accordionService: AccordionService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private contactService: ContactService,
  ) {}

  get canSubmit(): boolean {
    return this.select.isValid;
  }

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    this.contactService.create(this.debtId, guid, this.select.person)
      .subscribe(() => {
        this.accordionService.next();
        this.cdRef.markForCheck();
      });
  }
}

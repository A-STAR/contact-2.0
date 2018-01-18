import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { ContactRegistrationService } from './contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration',
  templateUrl: './contact-registration.component.html',
})
export class ContactRegistrationComponent {
  @Input() contactTypeCode: number;
  @Input() debtId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  get mode(): 'tree' | 'form' {
    return this.contactRegistrationService.mode;
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { ContactRegistrationService } from './contact-registration.service';
import { IContactRegistrationMode } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

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

  get showTree(): boolean {
    return this.contactRegistrationService.mode === IContactRegistrationMode.TREE;
  }
}

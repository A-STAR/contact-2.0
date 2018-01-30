import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { ContactRegistrationService } from './contact-registration.service';
import {
  IContactRegistrationMode,
  IContactRegistrationStatus,
} from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration',
  templateUrl: './contact-registration.component.html',
})
export class ContactRegistrationComponent {
  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  get showDialog$(): Observable<boolean> {
    return this.contactRegistrationService.shouldConfirm$;
  }

  get showEdit$(): Observable<boolean> {
    return this.contactRegistrationService.mode$.pipe(
      map(mode => mode === IContactRegistrationMode.EDIT),
    );
  }

  get showTree$(): Observable<boolean> {
    return this.contactRegistrationService.mode$.pipe(
      map(mode => mode === IContactRegistrationMode.TREE),
    );
  }

  onConfirm(): void {
    this.contactRegistrationService.status = null;
  }

  onCloseDialog(): void {
    this.contactRegistrationService.status = IContactRegistrationStatus.REGISTRATION;
  }
}

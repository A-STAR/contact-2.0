import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RegisterContactService } from '../register-contact.service';

@Component({
  selector: 'app-register-contact-misc',
  templateUrl: 'misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscComponent {
  @Input() debtId: number;

  constructor(
    private registerContactService: RegisterContactService,
  ) {}

  get canRegisterSpecial$(): Observable<boolean> {
    return this.registerContactService.canRegisterSpecial$(this.debtId);
  }

  get canRegisterOfficeVisit$(): Observable<boolean> {
    return this.registerContactService.canRegisterOfficeVisit$(this.debtId);
  }
}

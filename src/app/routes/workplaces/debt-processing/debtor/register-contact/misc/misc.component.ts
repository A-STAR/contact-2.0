import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RegisterContactService } from '../register-contact.service';

@Component({
  selector: 'app-register-contact-misc',
  templateUrl: 'misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscComponent {
  @Output() actionSpecial = new EventEmitter<void>();
  @Output() actionOfficeVisit = new EventEmitter<void>();

  constructor(
    private registerContactService: RegisterContactService,
  ) {}

  get canRegisterSpecial$(): Observable<boolean> {
    return this.registerContactService.canRegisterSpecial$();
  }

  get canRegisterOfficeVisit$(): Observable<boolean> {
    return this.registerContactService.canRegisterOfficeVisit$();
  }

  onSubmitSpecial(): void {
    this.actionSpecial.emit();
  }

  onSubmitOfficeVisit(): void {
    this.actionOfficeVisit.emit();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from '../../debtor.service';

@Component({
  selector: 'app-register-contact-misc',
  templateUrl: 'misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscComponent {
  @Output() actionSpecial = new EventEmitter<void>();
  @Output() actionOfficeVisit = new EventEmitter<void>();

  constructor(
    private debtorService: DebtorService,
  ) {}

  get canRegisterSpecial$(): Observable<boolean> {
    return this.debtorService.canRegisterSpecial$;
  }

  get canRegisterOfficeVisit$(): Observable<boolean> {
    return this.debtorService.canRegisterOfficeVisit$;
  }

  onSubmitSpecial(): void {
    this.actionSpecial.emit();
  }

  onSubmitOfficeVisit(): void {
    this.actionOfficeVisit.emit();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebtService } from '@app/core/debt/debt.service';

@Component({
  selector: 'app-register-contact-misc',
  templateUrl: 'misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscComponent {
  @Output() actionSpecial = new EventEmitter<void>();
  @Output() actionOfficeVisit = new EventEmitter<void>();

  constructor(
    private debtService: DebtService,
  ) {}

  get canRegisterSpecial$(): Observable<boolean> {
    return this.debtService.canRegisterSpecial$;
  }

  get canRegisterOfficeVisit$(): Observable<boolean> {
    return this.debtService.canRegisterOfficeVisit$;
  }

  onSubmitSpecial(): void {
    this.actionSpecial.emit();
  }

  onSubmitOfficeVisit(): void {
    this.actionOfficeVisit.emit();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

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
    private workplacesService: WorkplacesService,
  ) {}

  readonly canRegisterSpecial$: Observable<boolean> = this.debtorService.canRegisterSpecial$;

  readonly canRegisterOfficeVisit$: Observable<boolean> = this.workplacesService.canRegisterOfficeVisit$;

  onSubmitSpecial(): void {
    this.actionSpecial.emit();
  }

  onSubmitOfficeVisit(): void {
    this.actionOfficeVisit.emit();
  }
}

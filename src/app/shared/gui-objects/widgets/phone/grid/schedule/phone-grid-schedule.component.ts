import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from '../../../../../../routes/workplaces/debt-processing/debtor/debtor.service';

@Component({
  selector: 'app-phone-grid-schedule',
  templateUrl: './phone-grid-schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleComponent {
  @Input() phoneId: number;
  @Output() submit = new EventEmitter<Partial<any>>();
  @Output() cancel = new EventEmitter<void>();

  private routeParams = (<any>this.route.params).value;
  personId = this.routeParams.contactId || this.routeParams.id || null;

  constructor(
    private debtorService: DebtorService,
    private route: ActivatedRoute,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorService.currentDebt$().map(debt => debt && debt.debtId);
  }

  get canSubmit(): boolean {
    return true;
    // return this.form.canSubmit;
  }

  onSubmit(): void {
    this.submit.emit(null);
    // this.submit.emit(this.form.requestValue);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

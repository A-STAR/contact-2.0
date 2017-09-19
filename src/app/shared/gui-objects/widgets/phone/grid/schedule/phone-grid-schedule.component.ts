import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPerson } from '../../../../../../routes/workplaces/debt-processing/debtor/debtor.interface';

@Component({
  selector: 'app-phone-grid-schedule',
  templateUrl: './phone-grid-schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleComponent {
  @Input() person: IPerson;
  @Input() phoneId: number;
  @Output() submit = new EventEmitter<Partial<any>>();
  @Output() cancel = new EventEmitter<void>();

  private routeParams = (<any>this.route.params).value;
  debtId = this.routeParams.debtId || null;

  constructor(
    private route: ActivatedRoute,
  ) {}

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

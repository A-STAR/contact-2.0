import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-phone-grid-schedule',
  templateUrl: './phone-grid-schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleComponent {
  @Output() submit = new EventEmitter<Partial<any>>();
  @Output() cancel = new EventEmitter<void>();

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

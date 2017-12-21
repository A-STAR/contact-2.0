import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mass-sms',
  templateUrl: 'sms.component.html'
})
export class SmsComponent {
  @Input() debtIds: number[];
  @Input() personIds: number[];
  @Input() personRoles: number[];

  @Output() close = new EventEmitter<void>();

  controls = [];

  onSubmit(): void {
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}

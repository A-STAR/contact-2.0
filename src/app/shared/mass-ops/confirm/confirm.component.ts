import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';

@Component({
  selector: 'app-mass-confirm',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent {
  @Input() confirmParams: { count: number; total: number; };
  @Input() actionName: string;
  @Output() close = new EventEmitter<ICloseAction>();
  @Output() confirm = new EventEmitter<string>();

  onConfirm(): void {
    this.confirm.emit(this.actionName);
  }

  onClose(): void {
    this.close.emit();
  }

}

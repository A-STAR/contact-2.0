import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-template-grid-edit',
  templateUrl: './message-template-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplateGridEditComponent {
  @Input() templateId: number;

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get canSubmit(): boolean {
    return true;
  }

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

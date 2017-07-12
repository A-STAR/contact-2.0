import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html'
})
export class ActionDialogComponent {

  @Input() autoWidth = true;
  @Input() titleTranslationParams;
  @Input() titleTranslationKey: string;
  @Input() cancelTranslationKey = 'default.buttons.cancel';
  @Input() actionTranslationKey = 'default.buttons.save';
  @Input() actionMode = 'success';
  @Input() canSubmit = true;
  @Input() styles = {} as CSSStyleDeclaration;

  @Output() action: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.close();
    }
  }

  onAction(): void {
    this.action.emit();
  }

  onCancel(): void {
    this.close();
  }

  private close(): void {
    this.cancel.emit();
  }
}

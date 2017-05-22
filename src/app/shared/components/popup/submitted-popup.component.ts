import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-submitted-popup',
  templateUrl: './submitted-popup.html'
})
export class SubmittedPopupComponent {

  @Input() titleParams;
  @Input() messageParams;
  @Input() titleTranslationKey: string;
  @Input() actionTranslationKey: string;
  @Input() cancelMessage = 'default.buttons.cancel';
  @Input() actionMessage = 'default.buttons.save';
  @Input() actionMode = 'success';

  @Output() action: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @Input() errorMessage: string;

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

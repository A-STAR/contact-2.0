import { EventEmitter, Output } from '@angular/core';

export class SubmittedPopup {

  @Output() submit: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.close();
    }
  }

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.close();
  }

  private close(): void {
    this.cancel.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-submitted-popup',
  templateUrl: './submitted-popup.html'
})
export class SubmittedPopupComponent {

  @Input() titleParams;
  @Input() messageParams;
  @Input() title: string;
  @Input() message: string;
  @Input() cancelMessage = 'default.buttons.cancel';
  @Input() submitMessage = 'default.buttons.save';

  @Output() submit: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @Input() errorMessage: string;

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

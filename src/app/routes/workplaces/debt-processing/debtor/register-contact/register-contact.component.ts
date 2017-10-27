import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-register-contact-dialog',
  templateUrl: './register-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterContactComponent {
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get canSubmit(): boolean {
    return false;
  }

  onSubmit(): void {
    this.submit.emit({});
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

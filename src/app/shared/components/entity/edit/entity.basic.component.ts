import { EventEmitter, Output } from '@angular/core';

export class EntityBasicComponent<T> {

  @Output() submit: EventEmitter<T> = new EventEmitter<T>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  onDisplayChange(event: boolean): void {
    if (event === false) {
      this.close();
    }
  }

  onSubmit(): void {
    this.submit.emit(this.getSubmitValue());
  }

  onCancel(): void {
    this.close();
  }

  private close(): void {
    this.cancel.emit();
  }

  protected getSubmitValue(): any {
    return null;
  }
}

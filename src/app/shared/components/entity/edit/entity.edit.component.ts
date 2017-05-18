import { EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { DynamicFormComponent } from '../../form/dynamic-form/dynamic-form.component';
import { IDynamicFormControl } from '../../form/dynamic-form/dynamic-form-control.interface';

export abstract class EntityEditComponent<T> implements OnInit {

  @Input() editedEntity: T;
  @Input() editedMessage: string;
  @Output() submit: EventEmitter<T> = new EventEmitter<T>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl>;

  ngOnInit(): void {
    this.controls = this.getControls();
  }

  onDisplayChange(event: boolean): void {
    if (event === false) {
      this.close();
    }
  }

  onSubmit(): void {
    this.submit.emit(this.form.value);
  }

  onCancel(): void {
    this.close();
  }

  private close(): void {
    this.cancel.emit();
  }

  protected abstract getControls(): Array<IDynamicFormControl>;
}

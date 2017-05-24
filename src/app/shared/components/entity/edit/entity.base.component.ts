import { EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { DynamicFormComponent } from '../../form/dynamic-form/dynamic-form.component';
import { IDynamicFormControl, ISelectedItemsPayload } from '../../form/dynamic-form/dynamic-form-control.interface';

export abstract class EntityBaseComponent<T> implements OnInit {

  @Input() mode: string;
  @Input() title: string;
  @Input() editedEntity: T;
  @Input() editedMessage: string;
  @Output() submit: EventEmitter<T> = new EventEmitter<T>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl>;

  ngOnInit(): void {
    this.controls = this.getControls();
  }

  onSubmit(): void {
    this.submit.emit(this.form.value);
  }

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.close();
    }
  }

  onCancel(): void {
    this.close();
  }

  private close(): void {
    this.cancel.emit();
  }

  canSubmit(): boolean {
    return this.form.canSubmit;
  }

  onSelectedControlItemsChange(payload: ISelectedItemsPayload): void {
    // TODO
  }

  protected isEditMode(): boolean {
    return !!this.editedEntity;
  }

  protected abstract getControls(): Array<IDynamicFormControl>;
}

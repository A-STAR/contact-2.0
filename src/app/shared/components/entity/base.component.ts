import { EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { IDynamicFormItem } from '../form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '../form/dynamic-form/dynamic-form.component';

export abstract class EntityBaseComponent<T> implements OnInit {

  @Input() mode: string;
  @Input() title: string;
  @Input() editedEntity: T;
  @Output() submit: EventEmitter<T> = new EventEmitter<T>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) dynamicForm: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;

  ngOnInit(): void {
    this.controls = this.getControls();
  }

  onSubmit(): void {
    this.submit.emit(this.toSubmittedValues(this.dynamicForm.value));
  }

  toSubmittedValues(values: T): any {
    return values;
  }

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.close();
    }
  }

  onCancel(): void {
    this.close();
  }

  canSubmit(): boolean {
    return this.dynamicForm && this.dynamicForm.canSubmit;
  }

  protected isEditMode(): boolean {
    return 'update' === this.mode;
  }

  protected abstract getControls(): Array<IDynamicFormItem>;

  private close(): void {
    this.cancel.emit();
  }

}

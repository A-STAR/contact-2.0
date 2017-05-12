import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from './roles.interface';

export abstract class AbstractRolesPopup implements OnChanges {
  @Input() role: IRoleRecord;
  @Output() roleChange: EventEmitter<IRoleRecord> = new EventEmitter();
  @Output() onUpdate: EventEmitter<null> = new EventEmitter();

  form: FormGroup;

  abstract controls: Array<IDynamicFormControl>;

  ngOnChanges(changes: SimpleChanges) {
    this.form = this.createForm(changes.role.currentValue);
  }

  onDisplayChange(event) {
    if (event === false) {
      this.close();
    }
  }

  onActionClick() {
    this.httpAction()
      .then(data => {
        if (data.success) {
          this.onUpdate.emit();
          this.close();
        } else {
          throw new Error('Request error.');  // TODO: display error in popup dialog
        }
      })
      .catch(error => console.log(error));
  }

  onCancelClick() {
    this.close();
  }

  protected abstract createForm(role: IRoleRecord): FormGroup;

  protected abstract httpAction();

  private close() {
    this.role = null;
    this.roleChange.emit(null);
  }
}

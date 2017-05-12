import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from './roles.interface';

export abstract class AbstractRolesPopup implements OnChanges {
  @Input() role: IRoleRecord;
  @Output() roleChange: EventEmitter<IRoleRecord> = new EventEmitter();
  @Output() onUpdate: EventEmitter<null> = new EventEmitter();

  form: FormGroup;

  error: string = null;

  abstract controls: Array<IDynamicFormControl>;

  ngOnChanges(changes: SimpleChanges) {
    this.form = this.createForm(changes.role.currentValue);
  }

  get canSubmit(): boolean {
    return this.form.dirty && this.form.valid;
  }

  onDisplayChange(event): void {
    if (event === false) {
      this.close();
    }
  }

  onActionClick(): void {
    this.error = null;
    this.httpAction()
      .subscribe(
        data => {
          if (data.success) {
            this.onUpdate.emit();
            this.close();
          } else {
            this.error = data.message;
          }
        },
        error => this.error = 'validation.DEFAULT_ERROR_MESSAGE'
      );
  }

  onCancelClick(): void {
    this.close();
  }

  protected abstract createForm(role: IRoleRecord): FormGroup;

  protected abstract httpAction(): Observable<any>;

  private close(): void {
    this.role = null;
    this.roleChange.emit(null);
  }
}

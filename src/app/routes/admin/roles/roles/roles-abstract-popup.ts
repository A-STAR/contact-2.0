import { EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from './roles.interface';

export abstract class AbstractRolesPopup implements OnInit {
  @Input() role: IRoleRecord;
  @Output() roleChange: EventEmitter<IRoleRecord> = new EventEmitter();
  @Output() onUpdate: EventEmitter<null> = new EventEmitter();

  form: FormGroup;

  error: string = null;

  controls: Array<IDynamicFormControl>;

  canSubmit = false;

  formValue = null;

  ngOnInit(): void {
    this.controls = this.getControls();
  }

  onFormValueChange(formValue: any): void {
    this.formValue = formValue;
  }

  onCanSubmitChange(canSubmit: boolean): void {
    this.canSubmit = canSubmit;
  }

  onDisplayChange(event: boolean): void {
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

  protected abstract getControls(): Array<IDynamicFormControl>;

  protected abstract httpAction(): Observable<any>;

  private close(): void {
    this.role = null;
    this.roleChange.emit(null);
  }
}

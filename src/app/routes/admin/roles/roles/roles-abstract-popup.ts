import { EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { IRoleRecord } from './roles.interface';

export abstract class AbstractRolesPopup implements OnInit {
  @Input() role: IRoleRecord;
  @Output() roleChange: EventEmitter<IRoleRecord> = new EventEmitter();
  @Output() onUpdate: EventEmitter<null> = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  error: string = null;

  controls: Array<IDynamicFormControl>;

  ngOnInit(): void {
    this.controls = this.getControls();
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

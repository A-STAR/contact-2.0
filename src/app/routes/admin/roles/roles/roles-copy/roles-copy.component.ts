import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import {
  IDynamicFormControl,
  IDynamicFormItem,
  IDynamicFormConfig
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { IPermissionRole } from '../../permissions.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent implements OnInit {
  @Input() mode: string;
  @Input() title: string;
  @Input() role: IPermissionRole;

  @Output() submit = new EventEmitter<IPermissionRole>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;
  config: IDynamicFormConfig = {
    labelKey: 'roles.roles.copy'
  };

  ngOnInit(): void {
    this.controls = this.getControls();
  }

  onSubmit(): void {
    this.submit.emit({ ...this.form.serializedUpdates, originalRoleId: this.role.id });
  }

  onClose(): void {
    this.close();
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  private close(): void {
    this.cancel.emit();
  }

  private getControls(): Array<IDynamicFormControl> {
    return [
      {
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        controlName: 'comment',
        type: 'textarea',
        rows: 2
      },
    ];
  }
}

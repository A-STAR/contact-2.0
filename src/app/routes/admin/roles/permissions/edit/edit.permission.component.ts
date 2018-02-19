import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPermissionModel } from '@app/routes/admin/roles/permissions.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { getFormControlConfig } from '@app/core/utils';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit.permission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPermissionComponent implements OnInit {

  @Input() permission: IPermissionModel;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<null>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  data: IPermissionModel;

  ngOnInit(): void {
    this.controls = this.getControls(this.permission);
    this.data = {
      ...this.permission,
      value: String(this.permission.value)
    };
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    this.save.emit(this.form.value);
  }

  private getControls(permission: IPermissionModel): IDynamicFormControl[] {
    const type = getFormControlConfig(permission);

    return [
      {
        label: 'ID',
        controlName: 'id',
        type: 'text',
        display: false,
        required: true
      },
      {
        label: 'roles.permissions.edit.type',
        controlName: 'typeCode',
        type: 'text',
        display: false,
        required: true
      },
      {
        label: 'roles.permissions.edit.name',
        controlName: 'name',
        type: 'text',
        required: true,
        disabled: true
      },
      {
        label: 'roles.permissions.edit.value',
        controlName: 'value',
        ...type,
        required: true
      },
      {
        label: 'roles.permissions.edit.description',
        controlName: 'dsc',
        type: 'textarea',
        disabled: true
      },
      {
        label: 'roles.permissions.edit.comment',
        controlName: 'comment',
        type: 'textarea'
      }
    ] as IDynamicFormControl[];
  }

}

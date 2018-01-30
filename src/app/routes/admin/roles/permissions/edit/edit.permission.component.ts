import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPermissionModel } from '../../../../../routes/admin/roles/permissions.interface';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit.permission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPermissionComponent implements OnInit {

  @Input() permission: any;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<null>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  data: IPermissionModel;

  ngOnInit(): void {
    this.controls = this.getControls();
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

  private getControls(): IDynamicFormControl[] {
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
        type: 'dynamic',
        dependsOn: 'typeCode',
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
    ];
  }

}

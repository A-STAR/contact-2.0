import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit.permission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPermissionComponent implements OnInit {

  @Input() record: any;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl>;

  // TODO: add type
  data: any;

  ngOnInit(): void {
    this.controls = this.getControls();
    this.data = this.getData();
  }

  getData(): any {
    return {
      ...this.record,
      value: String(this.record.value)
    };
  }

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.onCancel();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    this.save.emit(this.form.value);
  }

  private getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'ID',
        controlName: 'id',
        type: 'hidden',
        required: true
      },
      {
        label: 'roles.permissions.edit.type',
        controlName: 'typeCode',
        type: 'hidden',
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
        type: 'text',
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

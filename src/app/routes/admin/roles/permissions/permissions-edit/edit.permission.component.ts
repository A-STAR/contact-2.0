import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IDisplayProperties } from '../../roles.interface';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit.permission.component.html'
})
export class EditPermissionComponent implements OnInit {

  @Input() displayProperties: IDisplayProperties;
  @Input() record: any;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();

  controls: Array<IDynamicFormControl>;

  canSaveChanges = false;

  private formChanges: any;

  /**
   * @override
   */
  public ngOnInit(): void {
    this.createFormAndControls();
  }

  onFormValueChange(formChanges: any): void {
    this.formChanges = formChanges;
  }

  onCanSubmitChange(canSaveChanges: boolean): void {
    this.canSaveChanges = canSaveChanges;
  }

  private createFormAndControls(): void {
    this.controls = [
      {
        label: 'ID',
        controlName: 'id',
        value: this.record.id,
        type: 'hidden',
        required: true
      },
      {
        label: 'Тип',
        controlName: 'typeCode',
        value: this.record.typeCode,
        type: 'hidden',
        required: true
      },
      {
        label: 'Название',
        controlName: 'name',
        value: this.record.name,
        type: 'text',
        required: true
      },
      {
        label: 'Значение',
        controlName: 'value',
        value: String(this.record.value),
        type: 'dynamic',
        dependsOn: 'typeCode',
        required: true
      },
      {
        label: 'Описание',
        controlName: 'dsc',
        value: this.record.dsc,
        type: 'text'
      },
      {
        label: 'Комментарий',
        controlName: 'comment',
        value: this.record.comment,
        type: 'textarea'
      }
    ];
  }

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.onCancel();
    }
  }

  onCancel(): void {
    this.displayProperties.editPermit = false;
  }

  onSave(): void {
    this.save.emit(this.formChanges);
  }
}

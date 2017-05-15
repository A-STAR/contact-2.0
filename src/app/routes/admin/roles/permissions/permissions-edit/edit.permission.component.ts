import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  // form: FormGroup;
  controls: Array<IDynamicFormControl>;
  private formChanges: any;

  canSaveChanges = false;

  constructor(private fb: FormBuilder) {
  }

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
    /*
    this.form = this.fb.group({
      id: new FormControl({value: this.record.id, disabled: true}, Validators.required),
      typeCode: [this.record.typeCode, Validators.required],
      name: [this.record.name, Validators.required],
      value: [String(this.record.value), Validators.required],
      comment: [this.record.comment],
      dsc: [this.record.dsc]
    });

    this.form.valueChanges.subscribe((formChanges) => this.formChanges = formChanges);
    */

    this.controls = [
      {
        label: 'ID',
        controlName: 'id',
        value: this.record.id,
        type: 'number',
        required: true,
        disabled: true,
        // display: false
      },
      {
        label: 'Тип',
        controlName: 'typeCode',
        value: this.record.typeCode,
        type: 'number',
        required: true,
        disabled: true,
        // display: false
      },
      {
        label: 'Название',
        controlName: 'name',
        type: 'text',
        disabled: true,
        required: true
      },
      {
        label: 'Значение',
        controlName: 'value',
        type: 'dynamic',
        dependsOn: 'typeCode',
        required: true
      },
      {
        label: 'Описание',
        controlName: 'dsc',
        type: 'text',
        disabled: true
      },
      {
        label: 'Комментарий',
        controlName: 'comment',
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

  /*
  canSaveChanges(): boolean {
    return this.form.dirty;
  }
  */

}

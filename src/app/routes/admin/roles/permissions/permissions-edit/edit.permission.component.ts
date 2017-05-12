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
  form: FormGroup;
  controls: Array<IDynamicFormControl>;
  private formChanges: any;

  constructor(private fb: FormBuilder) {
  }

  /**
   * @override
   */
  public ngOnInit(): void {
    this.createFormAndControls();
  }

  private createFormAndControls() {
    this.form = this.fb.group({
      id: new FormControl({value: this.record.id, disabled: true}, Validators.required),
      typeCode: [this.record.typeCode, Validators.required],
      name: [this.record.name, Validators.required],
      value: [String(this.record.value), Validators.required],
      comment: [this.record.comment],
      dsc: [this.record.dsc],
      altDsc: [this.record.altDsc]
    });

    this.form.valueChanges.subscribe((formChanges) => this.formChanges = formChanges);

    this.controls = [
      {
        label: 'Название',
        controlName: 'name',
        type: 'text',
        disabled: true
      },
      {
        label: 'Значение',
        controlName: 'value',
        type: 'dynamic',
        dependsOn: 'typeCode'
      },
      {
        label: 'Описание',
        controlName: 'dsc',
        type: 'text',
        disabled: true
      },
      {
        label: 'Описание на альтернативном языке',
        controlName: 'altDsc',
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

  onDisplayChange(event): void {
    if (event === false) {
      this.onCancel();
    }
  }

  onCancel() {
    this.displayProperties.editPermit = false;
  }

  onSave() {
    this.save.emit(this.formChanges);
  }

  canSaveChanges(): boolean {
    return this.form.dirty;
  }
}

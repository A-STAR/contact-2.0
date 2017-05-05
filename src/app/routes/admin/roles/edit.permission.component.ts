import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {IDynamicFormControl} from '../../../shared/components/form/dynamic-form/dynamic-form-control.interface';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit.permission.component.html'
})
export class EditPermissionComponent implements OnInit {

  @Input() displayProperties;
  @Input() record: any;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
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
      value: [parseInt(this.record.value, 10) ? '1' : '0', Validators.required], // TODO Make generic preparer for value
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
        type: 'boolean'
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
        type: 'text'
      }
    ];
  }

  onCancel() {
    this.cancel.emit(false);
  }

  onSave() {
    this.save.emit(this.formChanges);
  }

  canSaveChanges(): boolean {
    return this.form.dirty;
  }
}

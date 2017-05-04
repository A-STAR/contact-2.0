import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {IDynamicFormControl} from '../../../shared/components/form/dynamic-form/dynamic-form-control.interface';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit.permission.component.html'
})
export class EditPermissionComponent implements OnInit {

  @Input() display;
  @Input() record: any;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() save: EventEmitter<any> = new EventEmitter<any>(false);
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
      value: [this.record.value, Validators.required],
      comment: [this.record.comment],
      dsc: [this.record.dsc],
      altDsc: [this.record.altDsc]
    });

    this.form.valueChanges.subscribe((formChanges) => {
      this.formChanges = formChanges;
    });

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
        type: 'select',
        disabled: true,
        options: [
          {label: 'TRUE', value: 1},
          {label: 'FALSE', value: 0},
        ]
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

  private onCancel() {
    this.cancel.emit(false);
  }

  private onSave() {
    this.save.emit(this.formChanges);
  }

  get visibility(): boolean {
    return this.display;
  }

  set visibility(visible: boolean) {
    this.cancel.emit(visible);
  }
}

import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { GridService } from '../../../../shared/components/grid/grid.service';

// TODO:
type IConstant = any;

@Component({
  selector: 'app-constant-edit',
  templateUrl: 'constant-edit.component.html'
})
export class ConstantEditComponent implements OnInit {
  @Input() constant: IConstant;
  @Output() constantChange: EventEmitter<IConstant> = new EventEmitter();
  @Output() onUpdate: EventEmitter<null> = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  error: string = null;

  controls: Array<IDynamicFormControl>;

  // TODO: add type
  data: any;

  constructor(private datePipe: DatePipe, private gridService: GridService) { }

  ngOnInit(): void {
    this.controls = this.getControls();
    this.data = this.getData();
  }

  onDisplayChange(event: boolean): void {
    if (event === false) {
      this.close();
    }
  }

  getFieldValue(field: string): any {
    return this.form.value[field];
  }

  valueToIsoDate(value: any): string {
    const converted = value.split('.').reverse().map(Number);
    return this.datePipe.transform(new Date(converted), 'yyyy-MM-ddTHH:mm:ss') + 'Z';
  }

  onActionClick(): void {
    const id = this.getFieldValue('id');
    const typeCode = this.getFieldValue('typeCode');
    const value = this.getFieldValue('value');
    const fieldMap: object = {
      1: 'valueN',
      2: 'valueD',
      3: 'valueS',
      4: 'valueB',
    };
    const field: string = fieldMap[typeCode];
    const body = { [field]: value };

    if (typeCode === 4) {
      // convert the boolean to a number
      body[field] = Number(value);
    } else if (typeCode === 2) {
      // convert the date back to ISO8601
      body[field] = this.valueToIsoDate(value);
    }

    this.gridService
      .update('/api/constants/{id}', { id }, body)
      .subscribe(
        resp => {
          this.close();
          this.onUpdate.emit();
        },
        // TODO: display & log a message
        error => console.log(error.statusText || error.status || 'Request error')
      );
  }

  onCancelClick(): void {
    this.close();
  }

  getControls(): Array<IDynamicFormControl> {
    const options = [
      { label: 'Число', value: 1 },
      { label: 'Дата', value: 2 },
      { label: 'Строка', value: 3 },
      { label: 'Булево', value: 4 },
      { label: 'Деньги', value: 5 },
      { label: 'Словарь', value: 6 },
    ];

    return [
      {
        label: 'Ид',
        controlName: 'id',
        type: 'hidden',
        required: true,
        disabled: true
      },
      {
        label: 'Название константы',
        controlName: 'name',
        type: 'text',
        required: true,
        disabled: true
      },
      {
        label: 'Тип',
        controlName: 'typeCode',
        type: 'select',
        required: true,
        disabled: true,
        options
      },
      {
        label: 'Значение',
        controlName: 'value',
        type: 'dynamic',
        dependsOn: 'typeCode',
        required: true
      },
      {
        label: 'Комментарий',
        controlName: 'dsc',
        type: 'textarea',
        required: true,
        disabled: true,
        rows: 2
      },
    ];
  }

  getData(): any {
    return {
      ...this.constant,
      typeCode: this.constant.typeCode,
      // TODO: can we just write `value: String(this.constant)` like we do in permits form?
      // FIXME: value form control always renders as text input regerdless of typeCode
      value: this.getValueField(this.constant)
    };
  }

  getValueField(constant: IConstant): any {
    const value = constant.value;
    switch (constant.typeCode) {
      case 2:
        return this.datePipe.transform(new Date(constant.valueD), 'dd.MM.yyyy');
      case 3:
        return value || null;
      case 4:
        return value === 'Истина' ? '1' : '0';
      case 1:
      default:
        return value;
    }
  }

  private close(): void {
    this.constant = null;
    this.constantChange.emit(null);
  }
}

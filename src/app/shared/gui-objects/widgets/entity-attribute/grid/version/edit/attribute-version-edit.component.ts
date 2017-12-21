import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { IAttribute, IAttributeVersion, IAttributeVersionForm } from '../../../attribute.interface';
import { IDynamicFormControl } from '../../../../../../components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '../../../../../../components/form/dynamic-form/dynamic-form.component';

import { getFormControlConfig, getRawValue, getValue } from '../../../../../../../core/utils/value';
import { makeKey } from '../../../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-version-edit',
  templateUrl: './attribute-version-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeVersionEditComponent implements OnInit {
  @Input() selectedVersion: IAttributeVersion;
  @Input() selectedAttribute: IAttribute;
  @Input() entityTypeId: number;

  @Output() submit = new EventEmitter<Partial<IAttributeVersionForm>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  formData: IAttributeVersionForm;

  constructor(
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.onInit(this.selectedVersion && !!this.selectedAttribute);
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const value = this.form.serializedValue.value;
    const data = {
      ...this.form.serializedUpdates,
      value,
      changeDateTime: this.form.serializedUpdates.changeDateTime || this.selectedVersion.fromDateTime,
      ...getValue(this.selectedAttribute.typeCode, value)
    };
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private onInit(isEdit: boolean = false): void {
    this.controls = this.buildControls(this.selectedAttribute);
    this.formData = {
      changeDateTime: isEdit ? (this.selectedVersion.changeDateTime || this.selectedVersion.fromDateTime)
        : this.selectedAttribute.changeDateTime,
      value: getRawValue(isEdit ?
        {
          ...this.selectedVersion,
          typeCode: this.selectedAttribute.typeCode,
        }
        : this.selectedAttribute)
    };
    this.cdRef.markForCheck();
  }

  private buildControls(attr: IAttribute): IDynamicFormControl[] {
    return [
      {
        label: labelKey('value'),
        controlName: 'value',
        required: true,
        ...getFormControlConfig(attr)
      },
      {
        label: labelKey('changeDateTime'),
        controlName: 'changeDateTime',
        required: true,
        type: 'datepicker',
      },
      {
        label: labelKey('comment'),
        controlName: 'comment',
        type: 'textarea',
      },
    ] as IDynamicFormControl[];
  }

}

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

import { IAttribute, IAttributeForm } from '../../attribute.interface';
import { IDynamicFormControl } from '../../../../../components/form/dynamic-form/dynamic-form.interface';

import { AttributeService } from '../../attribute.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { getFormControlConfig, getRawValue, getValue } from '../../../../../../core/utils/value';
import { makeKey } from '../../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-grid-edit',
  templateUrl: './attribute-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridEditComponent implements OnInit {
  @Input() attributeCode: number;
  @Input() debtId: number;
  @Input() entityTypeId: number;

  @Output() submit = new EventEmitter<Partial<IAttributeForm>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  attribute: IAttribute;
  formData: IAttributeForm;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const { value, ...rest } = this.form.getSerializedUpdates();
    this.submit.emit({
      ...rest,
      ...(value ? getValue(this.attribute.typeCode, value) : {})
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private fetch(): void {
    this.attributeService.fetch(this.entityTypeId, this.debtId, this.attributeCode).subscribe(attribute => {
      if (attribute.dictNameCode) {
        console.log(attribute.dictNameCode);
      }
      this.controls = this.buildControls(attribute);
      this.attribute = attribute;
      this.formData = {
        comment: this.attribute.comment,
        value: getRawValue(this.attribute)
      };
      this.cdRef.markForCheck();
    });
  }

  private buildControls(attribute: IAttribute): IDynamicFormControl[] {
    return [
      {
        label: labelKey('value'),
        controlName: 'value',
        required: true,
        ...getFormControlConfig(attribute)
      },
      {
        label: labelKey('comment'),
        controlName: 'comment',
        type: 'textarea',
      },
    ] as IDynamicFormControl[];
  }
}

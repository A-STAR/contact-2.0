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
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { getFormControlConfig, getRawValue, getValue } from '@app/core/utils/value';
import { makeKey } from '@app/core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-entity-attribute-grid-edit',
  templateUrl: './attribute-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridEditComponent implements OnInit {
  @Input() selectedAttribute: IAttribute;
  @Input() debtId: number;
  @Input() entityTypeId: number;

  @Output() submit = new EventEmitter<Partial<IAttributeForm>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  formData: IAttributeForm;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    if (this.selectedAttribute.dictNameCode) {
      this.userDictionariesService.getDictionaryAsOptions(this.selectedAttribute.dictNameCode)
        .subscribe(options => this.onInit(options));
    } else {
      this.onInit();
    }
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const { value, ...rest } = this.form.serializedUpdates;
    const data = {
      ...rest,
      code: this.selectedAttribute.code,
      ...getValue(this.selectedAttribute.typeCode, value || this.formData.value)
    };
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private onInit(options: IOption[] = null): void {
    this.controls = this.buildControls(this.selectedAttribute, options);
    this.formData = {
      comment: this.selectedAttribute.comment,
      value: getRawValue(this.selectedAttribute)
    };
    this.cdRef.markForCheck();
  }

  private buildControls(attribute: IAttribute, options: IOption[]): IDynamicFormControl[] {
    return [
      {
        label: labelKey('value'),
        controlName: 'value',
        ...getFormControlConfig(attribute),
        ...(options ? { options } : {}),
      },
      {
        label: labelKey('comment'),
        controlName: 'comment',
        type: 'textarea',
      },
    ] as IDynamicFormControl[];
  }
}

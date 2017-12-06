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

import { IAttributeVersion, IAttributeVersionForm } from '../../../attribute.interface';
import { IDynamicFormControl } from '../../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../../../core/converter/value-converter.interface';

import { UserDictionariesService } from '../../../../../../../core/user/dictionaries/user-dictionaries.service';
import { DynamicFormComponent } from '../../../../../../components/form/dynamic-form/dynamic-form.component';

import { getFormControlConfig, getRawValue, getValue } from '../../../../../../../core/utils/value';
import { makeKey } from '../../../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-version-edit',
  templateUrl: './attribute-version-edit.component.html'
})
export class AttributeVersionEditComponent implements OnInit {
  @Input() selectedVersion: IAttributeVersion;
  @Input() selectedAttributeId: number;
  @Input() entityTypeId: number;

  @Output() submit = new EventEmitter<Partial<IAttributeVersionForm>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  formData: IAttributeVersionForm;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    if (this.selectedVersion.dictNameCode) {
      this.userDictionariesService.getDictionaryAsOptions(this.selectedVersion.dictNameCode)
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
      ...getValue(this.selectedVersion.typeCode, value)
    };
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private onInit(options: IOption[] = null): void {
    this.controls = this.buildControls(this.selectedVersion, options);
    this.formData = {
      fromDateTime: this.selectedVersion.fromDateTime || this.selectedVersion.changeDateTime,
      value: getRawValue(this.selectedVersion)
    };
    this.cdRef.markForCheck();
  }

  private buildControls(version: IAttributeVersion, options: IOption[]): IDynamicFormControl[] {
    return [
      {
        label: labelKey('value'),
        controlName: 'value',
        ...getFormControlConfig(version),
        ...(options ? { options } : {}),
      },
      {
        label: labelKey('fromDateTime'),
        controlName: 'fromDateTime',
        type: 'datepicker',
      },
    ] as IDynamicFormControl[];
  }

}

import {
  Component, ChangeDetectorRef , ChangeDetectionStrategy, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { IConstant } from '../constants.interface';
import { IDynamicFormControl, IDynamicFormItem } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ValueConverterService } from '../../../../core/converter/value-converter.service';
import { makeKey } from '../../../../core/utils';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

const label = makeKey('constants.edit');

@Component({
  selector: 'app-constant-edit',
  templateUrl: './constant-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstantEditComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() constant: IConstant;
  @Output() submit = new EventEmitter<IConstant>();
  @Output() cancel = new EventEmitter<void>();

  private localizedOptions: any;
  private langSub: Subscription;

  controls: Array<IDynamicFormItem>;
  formData: IConstant;

  constructor(
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private valueConverterService: ValueConverterService,
  ) {}

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  ngOnInit(): void {
    this.localizedOptions = this.translateService.instant('default.typeCode');
    this.langSub = this.translateService.onLangChange
      .subscribe(event => this.localizedOptions = event.translations.default.typeCode);

    this.controls = this.getControls();

    this.formData = {
      ...this.constant,
      value: this.constant.typeCode === 2
        ? this.valueConverterService.fromISO(this.constant.valueD)
        : this.constant.value
    };
    this.cdRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  onSubmit(): void {
    const typeCode = this.form.getControl('typeCode').value;
    const data = Object.assign({}, this.form.serializedUpdates, { typeCode });
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private getControls(): Array<IDynamicFormControl> {
    const options = [
      { label: this.localizedOptions.number, value: 1 },
      { label: this.localizedOptions.date, value: 2 },
      { label: this.localizedOptions.string, value: 3 },
      { label: this.localizedOptions.boolean, value: 4 },
      { label: this.localizedOptions.currency, value: 5 },
      { label: this.localizedOptions.dictionary, value: 6 },
    ];

    return [
      { label: label('id'), controlName: 'id', type: 'hidden', required: true, disabled: true },
      { label: label('name'), controlName: 'name', type: 'text', required: true, disabled: true },
      { label: label('typeCode'), controlName: 'typeCode', type: 'select', required: true, disabled: true, options },
      { label: label('value'), controlName: 'value', type: 'dynamic', dependsOn: 'typeCode', required: true },
      { label: label('dsc'), controlName: 'dsc', type: 'textarea', required: true, disabled: true },
    ];
  }
}

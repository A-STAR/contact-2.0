import { AfterViewInit, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { ILabeledValue } from '../../../core/converter/value-converter.interface';
import { IDynamicFormControl, IDynamicFormItem, ISelectItemsPayload
} from '../form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '../../../shared/components/form/dynamic-form/dynamic-form.component';

export class EntityTranslationComponent<T> implements AfterViewInit, OnInit {
  @Input() mode: string;
  @Input() title: string;
  @Input() editedEntity: T;
  @Output() submit: EventEmitter<T> = new EventEmitter<T>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) dynamicForm: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;
  displayControlName = 'translatedName';
  nameControlName = 'name';
  translatedControlName = 'nameTranslations';

  private _currentSelectedItem: ILabeledValue;

  onSubmit(): void {
    this.submit.emit(this.toSubmittedValues(this.dynamicForm.value));
  }

  toSubmittedValues(values: T): any {
    return values;
  }

  onClose(): void {
    this.close();
  }

  onCancel(): void {
    this.close();
  }

  canSubmit(): boolean {
    return this.dynamicForm && this.dynamicForm.canSubmit;
  }

  ngOnInit(): void {
    this.controls = this.getControls();

    if (this.isEditMode()) {
      const dynamicDisplayControl: IDynamicFormControl = this.flattenFormControls(this.controls)
        .find((control: IDynamicFormControl) => this.displayControlName === control.controlName);

      // Form does not exist yet => resort to source entity
      const entityTranslatedControlValue: ILabeledValue[] = this.editedEntity[this.translatedControlName];
      if (!Array.isArray(entityTranslatedControlValue) || !entityTranslatedControlValue.length) {
        dynamicDisplayControl.disabled = true;
      }
    }
  }

  ngAfterViewInit(): void {
    this.patchDisplayControlValue();
    this.dynamicForm.form.valueChanges.subscribe(changes => {
      this.onChanges(changes);
    });
  }

  onChanges(changes: T): void {
    const currentSelectedItem: ILabeledValue = this.currentSelectedItem;
    if (currentSelectedItem) {
      if (this.displayControlValue) {
        currentSelectedItem.context = currentSelectedItem.context || {};
        currentSelectedItem.context.translation = this.displayControlValue;
      } else {
        delete currentSelectedItem.context;
      }
    }
  }

  onSelectItems(payload: ISelectItemsPayload): void {
    if (!this.isEditMode()) {
      return;
    }
    this._currentSelectedItem = payload.items.find((item: ILabeledValue) => item.selected);

    if (this.currentSelectedItem) {
      this.displayControl.enable({ onlySelf: true });
    } else {
      this.displayControl.disable({ onlySelf: true });
    }
    this.patchDisplayControlValue();
    this.translatedControl.markAsDirty();
  }

  filterControls(controls: IDynamicFormControl[]): IDynamicFormControl[] {
    return controls.filter(control => {
        return this.isEditMode()
        ? this.nameControlName !== control.controlName
        : ![this.translatedControlName, this.displayControlName].includes(control.controlName);
    });
  }

  protected getControls(): Array<IDynamicFormItem> {
    return this.controls;
  }

  protected isEditMode(): boolean {
    return 'update' === this.mode;
  }

  private close(): void {
    this.cancel.emit();
  }

  // TODO: duplication; see app/shared/components/form/dynamic-form/dynamic-form.component.ts
  private flattenFormControls(formControls: Array<IDynamicFormItem>): Array<IDynamicFormControl> {
    return formControls.reduce((acc, control: IDynamicFormControl) => {
      const controls = control.children ? this.flattenFormControls(control.children) : [ control ];
      return [
        ...acc,
        ...controls
      ];
    }, [] as Array<IDynamicFormControl>);
  }

  private patchDisplayControlValue(): void {
    const currentSelectedItem: ILabeledValue = this.currentSelectedItem;
    if (currentSelectedItem) {
      if (currentSelectedItem.context && currentSelectedItem.context.hasOwnProperty('translation')) {
        this.patchDisplayControl(currentSelectedItem.context.translation);
      } else {
        this.patchDisplayControl();
      }
    } else {
      this.patchDisplayControl();
    }
  }

  private patchDisplayControl(value: string = ''): void {
    if (this.displayControl) {
      this.displayControl.patchValue(value);
    }
  }

  private get currentSelectedItem(): ILabeledValue {
    if (this._currentSelectedItem) {
      return this._currentSelectedItem;
    }
    const selectedValues: ILabeledValue[] = this.translatedControlValue;
    if (!Array.isArray(selectedValues)) {
      return null;
    }
    return selectedValues.find((item: ILabeledValue) => item.selected);
  }

  private get translatedControlValue(): ILabeledValue[] {
    return this.formGroup.value[this.translatedControlName];
  }

  private get displayControlValue(): string {
    return this.formGroup.value[this.displayControlName];
  }

  private get displayControl(): AbstractControl {
    return this.formGroup.controls[this.displayControlName];
  }

  private get translatedControl(): AbstractControl {
    return this.formGroup.controls[this.translatedControlName];
  }

  private get formGroup(): FormGroup {
    return this.dynamicForm.form;
  }
}

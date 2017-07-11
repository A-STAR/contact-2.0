import { AfterViewInit, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import {
  IDynamicFormControl,
  IDynamicFormItem,
  ISelectItemsPayload
} from '../../form/dynamic-form/dynamic-form-control.interface';

import { DynamicFormComponent } from '../../form/dynamic-form/dynamic-form.component';

export abstract class EntityBaseComponent<T> implements OnInit, AfterViewInit {

  @Input() mode: string;
  @Input() title: string;
  @Input() editedEntity: T;
  @Output() submit: EventEmitter<T> = new EventEmitter<T>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) dynamicForm: DynamicFormComponent;

  extensions: IEntityBaseComponentExtension<T>[] = [];
  controls: Array<IDynamicFormItem>;

  ngOnInit(): void {
    this.controls = this.getControls();
    this.extensions.forEach((extension: IEntityBaseComponentExtension<T>) => extension.onInit());
  }

  ngAfterViewInit(): void {
    this.extensions.forEach((extension: IEntityBaseComponentExtension<T>) => extension.onAfterInit());

    this.dynamicForm.form.valueChanges.subscribe((changes) => {
      this.extensions.forEach((extension: IEntityBaseComponentExtension<T>) => extension.onChanges(changes));
    });
  }

  onSubmit(): void {
    this.submit.emit(this.toSubmittedValues(this.dynamicForm.value));
  }

  toSubmittedValues(values: T): any {
    return values;
  }

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.close();
    }
  }

  onCancel(): void {
    this.close();
  }

  onSelectItems(payload: ISelectItemsPayload): void {
    this.extensions.forEach((extension: IEntityBaseComponentExtension<T>) =>
      extension.onSelectItems(payload));
  }

  private close(): void {
    this.cancel.emit();
  }

  canSubmit(): boolean {
    return this.dynamicForm.canSubmit;
  }

  protected isEditMode(): boolean {
    return 'update' === this.mode;
  }

  protected abstract getControls(): Array<IDynamicFormItem>;
}

export interface IEntityBaseComponentExtension<T> {
  onInit(): void;
  onAfterInit(): void;
  onChanges(changes: T): void;
  onSelectItems(payload: ISelectItemsPayload): void;
}

export class TranslationFieldsExtension<T> implements IEntityBaseComponentExtension<T> {

  private _currentSelectedItem: ILabeledValue;

  constructor(
    private entityBaseComponent: EntityBaseComponent<T>,
    private displayControlName: string,
    private translatedControlName: string
  ) {
  }

  onInit(): void {
    const dynamicDisplayControl: IDynamicFormControl = this.flattenFormControls(this.entityBaseComponent.controls)
      .find((control: IDynamicFormControl) => this.displayControlName === control.controlName);

    // Form does not exist yet => resort to source entity
    const entityTranslatedControlValue: ILabeledValue[] = this.entityBaseComponent.editedEntity[this.translatedControlName];
    if (!Array.isArray(entityTranslatedControlValue) || !entityTranslatedControlValue.length) {
      dynamicDisplayControl.disabled = true;
    }
  }

  // TODO: duplication; see app/shared/components/form/dynamic-form/dynamic-form.component.ts
  private flattenFormControls(formControls: Array<IDynamicFormItem>): Array<IDynamicFormControl> {
    // TODO: item type
    return formControls.reduce((acc, control: any) => {
      const controls = control.children ? this.flattenFormControls(control.children) : [ control ];
      return [
        ...acc,
        ...controls
      ];
    }, [] as Array<IDynamicFormControl>);
  }

  onAfterInit(): void {
    this.patchDisplayControlValue();
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
    this._currentSelectedItem = payload.items.find((item: ILabeledValue) => item.selected);

    if (this.currentSelectedItem) {
      this.displayControl.enable({ onlySelf: true });
    } else {
      this.displayControl.disable({ onlySelf: true });
    }
    this.patchDisplayControlValue();
    this.translatedControl.markAsDirty();
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
    this.displayControl.patchValue(value);
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
    return this.entityBaseComponent.dynamicForm.form;
  }
}

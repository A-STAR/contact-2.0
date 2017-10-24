import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IOption } from '../../../../../core/converter/value-converter.interface';

import { MultiListComponent } from '../../../list/multi/multi-list.component';

import { isEmpty } from '../../../../../core/utils';

type IMultiSelectValue = Array<number|string>;

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: [ './multi-select.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent implements ControlValueAccessor {
  @Input() nullable = false;
  @Input() options: IOption[] = [];

  @ViewChild(MultiListComponent) list: MultiListComponent<IOption>;

  private _isDisabled = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  get label(): string {
    if (isEmpty(this.selection)) {
      return null;
    }
    if (this.selection.length > 1) {
      // TODO(d.maltsev): i18n
      return `Выбрано элементов: ${this.selection.length}`;
    }
    const option = this.options.find(o => o.value === this.selection[0]);
    return option ? option.label : null;
  }

  getId = (option: IOption) => option.value;
  getName = (option: IOption) => option.label;

  onSelect(item: IOption): void {
    this.propagateChange(this.selection);
  }

  writeValue(value: IMultiSelectValue): void {
    this.value = value || [];
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  private get selection(): IMultiSelectValue {
    return this.list.selection.map(Number);
  }

  private set selection(selection: IMultiSelectValue) {
    this.list.selection = selection.map(Number);
  }

  private set value(value: IMultiSelectValue) {
    this.selection = value;
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}

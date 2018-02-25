import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  forwardRef, Input, ViewChild, Output, EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IOption } from '../../../../../core/converter/value-converter.interface';

import { MultiListComponent } from '../../../list/multi/multi-list.component';

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

  @Input() options: IOption[] = [];

  @Input()
  set controlDisabled(value: boolean) {
    this.setDisabledState(value);
  }

  @Output() select = new EventEmitter<IMultiSelectValue>();

  @ViewChild(MultiListComponent) set list(list: MultiListComponent<IOption>) {
    this._list = list;
    this.selection = this._selection;
    this.cdRef.detectChanges();
  }

  private _list: MultiListComponent<IOption>;
  private _isDisabled = false;
  private _selection: IMultiSelectValue;

  constructor(private cdRef: ChangeDetectorRef) {}

  get selectionLength(): number {
    return this.selection && this.selection.length || 0;
  }

  get label(): string {
    const option = this.options.find(o => o.value === this.selection[0]);
    return option ? option.label : null;
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  getId = (option: IOption) => option.value;
  getName = (option: IOption) => option.label;

  onSelect(item: IOption): void {
    this.propagateChange(this.selection);
    this.select.emit(this.selection);
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
    if (this._list) {
      this._selection = this._list.selection.map(Number);
    }
    return this._selection;
  }

  private set selection(selection: IMultiSelectValue) {
    this._selection = selection.map(Number);
    if (this._list) {
      this._list.selection = this._selection;
    }
  }

  private set value(value: IMultiSelectValue) {
    this.selection = value;
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}

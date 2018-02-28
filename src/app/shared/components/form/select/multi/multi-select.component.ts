import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IOption } from '@app/core/converter/value-converter.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

import { MultiListComponent } from '../../../list/multi/multi-list.component';
import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { Subscription } from 'rxjs/Subscription';

type IMultiSelectValue = number[];

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
export class MultiSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() dictCode: number;
  @Input() lookupKey: ILookupKey = null;
  @Input() options: IOption[] = [];

  @Input()
  set isDisabled(value: boolean) {
    this.setDisabledState(value);
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  @Output() select = new EventEmitter<IMultiSelectValue>();

  @ViewChild(MultiListComponent) set list(list: MultiListComponent<IOption>) {
    this._list = list;
    this.selection = this._selection;
    this.cdRef.detectChanges();
  }

  private _list: MultiListComponent<IOption>;
  private _isDisabled = false;
  private optionsSubscription: Subscription;
  private _selection: IMultiSelectValue;

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    if (this.dictCode && this.lookupKey) {
      throw new Error('MultiSelectComponent must have either dictCode or lookupKey but not both.');
    }
    if (this.dictCode) {
      this.optionsSubscription = this.userDictionariesService.getDictionaryAsOptions(this.dictCode)
        .subscribe(this.onOptionsFetch);
    }
    if (this.lookupKey) {
      this.optionsSubscription = this.lookupService.lookupAsOptions(this.lookupKey)
        .subscribe(this.onOptionsFetch);
    }
  }

  ngOnDestroy(): void {
    if (this.optionsSubscription) {
      this.optionsSubscription.unsubscribe();
    }
  }

  get selectionLength(): number {
    return this.selection && this.selection.length || 0;
  }

  get label(): string {
    const option = (this.options || []).find(o => o.value === this.selection[0]);
    return option ? option.label : null;
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

  onOptionsFetch = (options: IOption[]) => {
    this.options = options;
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}

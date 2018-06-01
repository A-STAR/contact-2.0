import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IMultiSelectOption } from '@app/shared/components/form/select/select.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { SortOptionsPipe } from '@app/shared/components/form/select/select.pipe';

@Component({
  selector: 'app-menu-select',
  templateUrl: './menu-select.component.html',
  styleUrls: ['./menu-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSelectComponent implements OnInit, OnDestroy {
  @Input() dictCode: number;
  @Input() lookupKey: ILookupKey;
  @Input() label: string;
  @Input() disabled = false;
  @Input() multi = true;

  @Output() action = new EventEmitter<number[]>();

  private optionsSubscription: Subscription;
  private value: number[] = [];
  private _options: IMultiSelectOption[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private sortOptionsPipe: SortOptionsPipe,
    private userDictionariesService: UserDictionariesService,
  ) { }

  ngOnInit(): void {
    if (this.dictCode && this.lookupKey) {
      throw new Error('MenuSelectComponent must have either dictCode or lookupKey but not both.');
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

  get isLeft(): boolean {
    return false;
  }

  get hasSelection(): boolean {
    return !!this.value.length;
  }

  get options(): IMultiSelectOption[] {
    return this._options || [];
  }

  set options(options: IMultiSelectOption[]) {
    this._options = <IMultiSelectOption[]>this.sortOptionsPipe
      .transform(<IMultiSelectOption[]>options)
      .map(o => ({ ...o, checked: this.value.includes(o.value) }));

    // Filter out value not found in options
    this.value = this.value.filter(v => this.options.some(o => o.value === v));
    this.cdRef.markForCheck();
  }

  onSelect(checked: boolean, option: IMultiSelectOption): void {
    option.checked = checked;
    this.value = checked
      ? Array.from(new Set([...this.value, option.value ]))
      : this.value.filter(o => o !== option.value);
    this.action.emit(this.value);
  }

  selectAll(): void {
    this.options.forEach(o => o.checked = true);
    this.cdRef.markForCheck();
  }

  deselectAll(): void {
    this.options.forEach(o => o.checked = false);
    this.cdRef.markForCheck();
  }

  getIconCls(): string {
    return this.isLeft ? 'menu-arrow-left fa-caret-left' : 'menu-arrow-right fa-caret-right';
  }

  ngOnDestroy(): void {
    if (this.optionsSubscription) {
      this.optionsSubscription.unsubscribe();
    }
  }

  trackByFn(option: IMultiSelectOption): number {
    return option.value;
  }

  private onOptionsFetch = (options: IMultiSelectOption[]) => {
    this.options = options;
  }

}

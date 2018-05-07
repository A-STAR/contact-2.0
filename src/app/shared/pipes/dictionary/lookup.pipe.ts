import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { LookupService } from '@app/core/lookup/lookup.service';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

@Pipe({
  name: 'lookup'
})
export class LookupPipe<T extends { name: string }> implements OnDestroy, PipeTransform {

  private langSub: Subscription;
  private _lookupSub: Subscription;
  private _items: T[];
  // pipe's result
  private _latestValue: any = '';
  private _latestReturnedValue: any = '';
  // pipe's params
  private _lookupKey: ILookupKey = null;
  private _lookupValue: any = null;
  private _lookupProps = ['code', 'name'];

  constructor(
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private lookupService: LookupService
  ) {
    this.langSub = this.translateService.onLangChange.subscribe(() => this.cdRef.markForCheck());
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
    if (this._lookupSub) {
      this.dispose();
    }
  }

  transform(value: any, lookupKey: ILookupKey, lookupProps?: [string, string]): string {
    if (!this._lookupKey) {
      if (lookupKey) {
        this._lookupKey = lookupKey;
        if (!this._lookupValue && value ) {
          this._lookupValue = value;
        }
        if (lookupProps && !this.equals(lookupProps)) {
          this._lookupProps = lookupProps;
        }
        this._subscribe();
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (this._lookupKey !== lookupKey) {
      this.dispose();
      return this.transform(value, lookupKey, lookupProps);
    }

    if (lookupProps && !this.equals(lookupProps)) {
      this._lookupProps = lookupProps;
      this._latestValue = this._update(this._lookupValue);
      return this._latestValue;
    }

    if (this._lookupValue !== value) {
      this._lookupValue = value;
      this._latestValue = this._update(this._lookupValue);
      return this._latestValue;
    }

    if (this._latestValue === this._latestReturnedValue) {
      return this._latestReturnedValue;
    }

    this._latestReturnedValue = this._latestValue;
    return this._latestValue;

  }

  private dispose(): void {
    this._lookupSub.unsubscribe();
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._lookupKey = null;
    this._lookupProps = ['code', 'name'];
    this._lookupValue = null;
    this._items = null;
  }

  private _subscribe(): void {
    this._lookupSub = this.lookupService
      .lookup<T>(this._lookupKey)
      .pipe(first())
      .subscribe(lookup => {
        this._items = lookup;
        this.updateLatestValue(this._lookupValue);
      });
  }

  private updateLatestValue(lookupValue: any): void {
    this._latestValue = this._update(lookupValue);
    this.cdRef.markForCheck();
  }

  private _update(lookupValue: any): any {
    const foundTerm = lookupValue && this._items ?
      this._items.find(item => item[this._lookupProps[0]] === lookupValue) : { [this._lookupProps[1]]: '' };
    return (foundTerm || { [this._lookupProps[1]]: '' })[this._lookupProps[1]];
  }

  private equals(tuple: [string, string]): boolean {
    return this._lookupProps[0] === tuple[0] && this._lookupProps[1] === tuple[1];
  }

}

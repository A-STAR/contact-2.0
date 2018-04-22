import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { first } from 'rxjs/operators';
import { IUserTerm } from '@app/core/user/dictionaries/user-dictionaries.interface';

@Pipe({
  name: 'dict',
  pure: false
})
export class DictPipe implements OnDestroy, PipeTransform {
  private langSub: Subscription;
  private _dictSub: Subscription;
  private _terms: IUserTerm[];
  // pipe's result
  private _latestValue = '';
  private _latestReturnedValue = '';
  // pipe's params
  private _dictCode: number = null;
  private _dictValue: number = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private userDictionaryService: UserDictionariesService
  ) {
    this.langSub = this.translateService.onLangChange.subscribe(() => this.cdRef.markForCheck());
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
    if (this._dictSub) {
      this.dispose();
    }
  }

  transform(dictValue: number, dictCode: number): string {
    if (!this._dictCode) {
      if (dictCode) {
        this._dictCode = dictCode;
        if (!this._dictValue && dictValue) {
          this._dictValue = dictValue;
        }
        this._subscribe();
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (this._dictCode !== dictCode) {
      this.dispose();
      return this.transform(dictValue, dictCode);
    }

    if (this._dictValue !== dictValue) {
      this._dictValue = dictValue;
      this._latestValue = this._update(this._dictValue);
      return this._latestValue;
    }

    if (this._latestValue === this._latestReturnedValue) {
      return this._latestReturnedValue;
    }

    this._latestReturnedValue = this._latestValue;
    return this._latestValue;

  }

  private dispose(): void {
    this._dictSub.unsubscribe();
    this._latestValue = '';
    this._latestReturnedValue = '';
    this._dictCode = null;
    this._dictValue = null;
    this._terms = null;
  }

  private _subscribe(): void {
    this._dictSub = this.userDictionaryService
      .getDictionary(this._dictCode)
      .pipe(first())
      .subscribe(dict => {
        this._terms = dict;
        this.updateLatestValue(this._dictValue);
      });
  }

  private updateLatestValue(dictValue: number): void {
    this._latestValue = this._update(dictValue);
    this.cdRef.markForCheck();
  }

  private _update(dictValue: number): string {
    const foundTerm = dictValue && this._terms ? this._terms.find(term => term.code === dictValue) : { name: '' };
    return (foundTerm || { name: '' }).name;
  }

}

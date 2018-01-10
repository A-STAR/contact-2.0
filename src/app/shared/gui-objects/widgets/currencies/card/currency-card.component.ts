import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ICurrency } from '../currencies.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IEntityTranslation } from '../../../../../core/entity/translations/entity-translations.interface';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { CurrenciesService } from '../currencies.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.currencies.card');

@Component({
  selector: 'app-currency-card',
  templateUrl: './currency-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() currencyId: number;

  controls: Array<IDynamicFormItem> = null;
  currency: Partial<ICurrency>;

  private languages: ILookupLanguage[];
  private currencies: ICurrency[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private currenciesService: CurrenciesService,
    private location: Location,
    private lookupService: LookupService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.currencyId ? this.currenciesService.canEdit$ : this.currenciesService.canAdd$,
      this.currencyId ? this.currenciesService.fetch(this.currencyId) : Observable.of({}),
      this.currencyId ? this.lookupService.lookup<ILookupLanguage>('languages') : of([]),
      this.currencyId ? this.currenciesService.readCurrencyNameTranslations(this.currencyId) : of([]),
      this.currencyId ? this.currenciesService.readCurrencyShortNameTranslations(this.currencyId) : of([]),
      this.currenciesService.fetchAll()
    )
    .pipe(first())
    .subscribe(([ canEdit, currency, languages, nameTranslations, shortNameTranslations, currencies ]) => {
      this.currency = currency;
      this.currency.multiName = nameTranslations;
      this.currency.multiShortName = shortNameTranslations;
      this.languages = languages;
      this.currencies = currencies;

      const languageOpts = languages.map(userLanguage =>
        ({ label: userLanguage.name, value: userLanguage.id, canRemove: !userLanguage.isMain, selected: userLanguage.isMain })
      );
      this.controls = this.initControls(canEdit, languageOpts);

      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.currencyId
      ? this.currenciesService.update(this.currencyId, this.serializeTranslatedCurrency(this.form.serializedUpdates))
      : this.currenciesService.create(this.form.serializedUpdates);

    action.subscribe(() => {
      this.currenciesService.dispatchAction(CurrenciesService.MESSAGE_CURRENCY_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.location.back();
  }

  private serializeTranslatedCurrency(currency: any): ICurrency {
    const isMultiNameChanged = currency.multiName && Object.keys(currency.multiName).length;
    const isMultiShortNameChanged = currency.multiShortName && Object.keys(currency.multiShortName).length;
    const result = {
      ...currency,
      id: this.currencyId,
      name: isMultiNameChanged ? this.createTranslations(currency.multiName) : currency.name,
      shortName: isMultiShortNameChanged ? this.createTranslations(currency.multiShortName) : currency.shortName,
    } as ICurrency;
    delete result.multiName;
    delete result.multiShortName;
    return result;
  }

  private createTranslations(selection: { [key: number]: string }[]): IEntityTranslation[] {
    return this.languages.map(language => ({
      languageId: language.id,
      value: selection[language.id]
    } as IEntityTranslation));
  }

  private initControls(canEdit: boolean, languageOptions: IOption[]): Array<IDynamicFormItem> {
    return [
      { label: label('code'), controlName: 'code', type: 'text', required: true, disabled: !canEdit },
      {
        label: label('name'),
        controlName: this.currencyId ? 'multiName' : 'name',
        type: this.currencyId ? 'multitext' : 'text',
        options: languageOptions,
        disabled: !canEdit
      },
      {
        label: label('shortName'),
        controlName: this.currencyId ? 'multiShortName' : 'shortName',
        type: this.currencyId ? 'multitext' : 'text',
        options: languageOptions.map(o => ({ ...o })),
        disabled: !canEdit
      },
      {
        label: label('isMain'), controlName: 'isMain', type: 'checkbox',
        disabled: !canEdit || (!!this.currencies.find(currency => !!currency.isMain) && !this.currency.isMain)
      },
    ];
  }
}

import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ICurrency } from '../currencies.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
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

  @Input() currencyId: number;

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  currency: Partial<ICurrency>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private currenciesService: CurrenciesService,
    private lookupService: LookupService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.currencyId ? this.currenciesService.canEdit$ : this.currenciesService.canAdd$,
      this.currencyId ? this.currenciesService.fetch(this.currencyId) : Observable.of({}),
      this.currencyId ? this.lookupService.languages : of([]),
    )
    .pipe(first())
    .subscribe(([ canEdit, currency, languages ]) => {
      this.controls = this.initControls(canEdit, languages);
      this.currency = currency;
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.currencyId
      ? this.currenciesService.update(this.currencyId, this.form.serializedValue)
      : this.currenciesService.create(this.form.serializedUpdates);

    action.subscribe(() => {
      this.currenciesService.dispatchAction(CurrenciesService.MESSAGE_CURRENCY_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.contentTabService.back();
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
        options: languageOptions,
        disabled: !canEdit
      },
      { label: label('isMain'), controlName: 'isMain', type: 'checkbox', disabled: !canEdit },
    ];
  }
}

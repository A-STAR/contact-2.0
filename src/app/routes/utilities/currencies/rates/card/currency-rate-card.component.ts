import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ICurrencyRate } from '../currency-rates.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { CurrencyRatesService } from '../currency-rates.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.currencyRates.card');

@Component({
  selector: 'app-currency-rate-card',
  templateUrl: './currency-rate-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyRateCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  currencyId = Number(this.route.snapshot.paramMap.get('currencyId'));
  currencyRateId = Number(this.route.snapshot.paramMap.get('currencyRateId'));

  controls: Array<IDynamicFormItem>;
  currencyRate: Partial<ICurrencyRate>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private currencyRatesService: CurrencyRatesService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.currencyRateId ? this.currencyRatesService.canEdit$ : this.currencyRatesService.canAdd$,
      this.currencyRateId ? this.currencyRatesService.fetch(this.currencyId, this.currencyRateId) : of({}),
    )
    .pipe(first())
    .subscribe(([ canEdit, currencyRate ]) => {
      this.controls = this.initControls(canEdit);
      this.currencyRate = currencyRate;
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.currencyRateId
      ? this.currencyRatesService.update(this.currencyId, this.serializeCurrencyRate(this.form.serializedUpdates))
      : this.currencyRatesService.create(this.currencyId, this.form.serializedUpdates);

    action.subscribe(() => {
      this.currencyRatesService.dispatchAction(CurrencyRatesService.MESSAGE_CURRENCY_RATE_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ '/app/utilities/currencies' ]);
  }

  private serializeCurrencyRate(currencyRate: ICurrencyRate): ICurrencyRate {
    return {
      fromDate: this.currencyRate.fromDate,
      ...currencyRate
    };
  }

  private initControls(canEdit: boolean): Array<IDynamicFormItem> {
    return [
      {
        label: label('fromDate'), controlName: 'fromDate', type: 'datepicker',
        required: true, disabled: !canEdit || !!this.currencyRateId
      },
      { label: label('rate'), controlName: 'rate', type: 'number', disabled: !canEdit, required: true },
    ];
  }
}

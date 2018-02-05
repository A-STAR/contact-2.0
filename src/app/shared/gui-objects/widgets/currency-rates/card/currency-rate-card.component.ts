import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ICurrencyRate } from '@app/shared/gui-objects/widgets/currency-rates/currency-rates.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { CurrencyRatesService } from '@app/shared/gui-objects/widgets/currency-rates/currency-rates.service';
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

  @Input() currencyId: number;
  @Input() currencyRateId: number;

  controls: Array<IDynamicFormItem> = null;
  currencyRate: Partial<ICurrencyRate>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private currencyRatesService: CurrencyRatesService,
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
    this.routingService.navigate([ '/utilities', 'currencies' ]);
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
        label: label('fromDateTime'), controlName: 'fromDateTime', type: 'datetimepicker',
        label: label('fromDate'), controlName: 'fromDate', type: 'datepicker', displayTime: false,
        required: true, disabled: !canEdit || !!this.currencyRateId
      },
      { label: label('rate'), controlName: 'rate', type: 'number', disabled: !canEdit, required: true },
    ];
  }
}

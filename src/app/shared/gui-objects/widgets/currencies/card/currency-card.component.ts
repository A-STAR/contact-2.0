import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ICurrency } from '@app/shared/gui-objects/widgets/currencies/currencies.interface';
import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';

import { CurrenciesService } from '@app/shared/gui-objects/widgets/currencies/currencies.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-currency-card',
  templateUrl: './currency-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() currencyId: number;

  config: IDynamicFormConfig = {
    labelKey: 'widgets.currencies.card',
  };
  controls: IDynamicFormItem[];
  currency: ICurrency;

  private currencies: ICurrency[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private currenciesService: CurrenciesService,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.currencyId ? this.currenciesService.canEdit$ : this.currenciesService.canAdd$,
      this.currencyId ? this.currenciesService.fetch(this.currencyId) : of({}),
      this.currenciesService.fetchAll()
    )
    .pipe(first())
    .subscribe(([ canEdit, currency, currencies ]) => {
      this.currency = currency;
      this.currencies = currencies;
      this.controls = this.initControls(canEdit);
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.currencyId
      ? this.currenciesService.update(this.currencyId, this.form.serializedUpdates)
      : this.currenciesService.create(this.form.serializedUpdates);

    action.subscribe(() => {
      this.currenciesService.dispatchAction(CurrenciesService.MESSAGE_CURRENCY_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ '/utilities', 'currencies' ]);
  }

  private initControls(canEdit: boolean): IDynamicFormItem[] {
    const controls = [
      {
        controlName: 'code',
        type: 'text',
        required: true,
        disabled: !canEdit
      },
      {
        controlName: 'names',
        type: 'multilanguage',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_CURRENCY_NAME,
          entityId: this.currency && this.currency.id
        },
        disabled: !canEdit,
        required: true
      },
      {
        controlName: 'shortNames',
        type: this.currencyId ? 'multilanguage' : 'text',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_CURRENCY_SHORT_NAME,
          entityId: this.currency && this.currency.id
        },
        disabled: !canEdit
      },
      {
        controlName: 'isMain',
        type: 'checkbox',
        disabled: !canEdit || (!!this.currencies.find(currency => !!currency.isMain) && !this.currency.isMain)
      },
    ];

    return controls as IDynamicFormItem[];
  }
}

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IDebtComponent } from '../debt-component.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DebtComponentService } from '../debt-component.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-component-card',
  templateUrl: './debt-component-card.component.html'
})
export class DebtComponentCardComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private debtId = (this.route.params as any).value.debtId || null;
  private debtComponentId = (this.route.params as any).value.debtComponentId || null;

  controls: Array<IDynamicFormItem> = null;
  debtComponent: IDebtComponent;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtComponentService: DebtComponentService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService
  ) {
    combineLatest(
      this.lookupService.currencyOptions,
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DEBT_COMPONENTS),
      this.debtComponentId ? this.debtComponentService.fetch(this.debtId, this.debtComponentId) : of(null)
    )
    .pipe(first())
    .subscribe(([ currencyOptions, debtComponentTypeOptions, debtComponent ]) => {
      this.controls = [
        {
          label: 'widgets.debt.component.grid.typeCode',
          controlName: 'typeCode',
          type: 'select',
          options: debtComponentTypeOptions,
          required: true
        },
        {
          label: 'widgets.debt.component.grid.amount',
          controlName: 'amount',
          type: 'text',
          required: true
        },
        {
          label: 'widgets.debt.component.grid.currencyId',
          controlName: 'currencyId',
          type: 'select',
          options: currencyOptions,
          required: true
        },
      ];
      this.debtComponent = debtComponent;
      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const data = this.form.serializedUpdates;
    const action = this.debtComponentId
      ? this.debtComponentService.update(this.debtId, this.debtComponentId, data)
      : this.debtComponentService.create(this.debtId, data);

    action.subscribe(() => {
      this.debtComponentService.dispatchAction(DebtComponentService.MESSAGE_DEBT_COMPONENT_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([
      '/workplaces',
      'debtor-card',
      this.route.snapshot.paramMap.get('debtId'),
      'debt'
    ]);
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IDebtComponent } from '../debt-component.interface';
import { IDynamicFormItem } from '../../../../../components/form/dynamic-form/dynamic-form.interface';

import { DebtComponentService } from '../debt-component.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

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
    private debtComponentService: DebtComponentService,
    private lookupService: LookupService,
    private router: Router,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
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
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

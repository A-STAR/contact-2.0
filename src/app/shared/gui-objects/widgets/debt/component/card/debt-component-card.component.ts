import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDebtComponent } from '../debt-component.interface';
import { IDynamicFormItem } from '../../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtComponentService } from '../debt-component.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-component-card',
  templateUrl: './debt-component-card.component.html'
})
export class DebtComponentCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  private debtId = (this.route.params as any).value.debtId || null;
  private debtComponentId = (this.route.params as any).value.debtComponentId || null;

  controls: Array<IDynamicFormItem> = null;
  debtComponent: IDebtComponent;

  constructor(
    private contentTabService: ContentTabService,
    private debtComponentService: DebtComponentService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
  ) {
    Observable.combineLatest(
      this.lookupService.currencyOptions,
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DEBT_COMPONENTS),
      this.debtComponentId ? this.debtComponentService.fetch(this.debtId, this.debtComponentId) : Observable.of(null)
    )
    .take(1)
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
          label: 'widgets.debt.component.grid.sum',
          controlName: 'sum',
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

  public onSubmit(): void {
    const { value } = this.form;
    const data = {
      ...value,
      typeCode: Array.isArray(value.typeCode) ? value.typeCode[0].value : value.typeCode,
      currencyId: Array.isArray(value.currencyId) ? value.currencyId[0].value : value.currencyId
    }

    const action = this.debtComponentId
      ? this.debtComponentService.update(this.debtId, this.debtComponentId, data)
      : this.debtComponentService.create(this.debtId, data);

    action.subscribe(() => {
      this.messageBusService.dispatch(DebtComponentService.MESSAGE_DEBT_COMPONENT_SAVED);
      this.onBack();
    });
  }

  public onBack(): void {
    this.contentTabService.back();
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

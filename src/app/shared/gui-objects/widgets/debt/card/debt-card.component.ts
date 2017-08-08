import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtService } from '../debt.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-card',
  templateUrl: './debt-card.component.html'
})
export class DebtCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;
  private debtId = (this.route.params as any).value.debtId || null;

  controls: Array<IDynamicFormItem> = null;
  debt: any;

  constructor(
    private contentTabService: ContentTabService,
    private debtService: DebtService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.debtId ? this.debtService.fetch(this.id, this.debtId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ debt ]) => {
      this.controls = [
        {
          width: 6,
          children: [
            { label: 'widgets.debt.grid.id', controlName: 'id', type: 'text', disabled: true },
            { label: 'widgets.debt.grid.portfolioId', controlName: 'portfolioId', type: 'text' },
            { label: 'widgets.debt.grid.bankId', controlName: 'bankId', type: 'text' },
            { label: 'widgets.debt.grid.creditName', controlName: 'creditName', type: 'text' },
            { label: 'widgets.debt.grid.creditTypeCode', controlName: 'creditTypeCode', type: 'text' },
            { label: 'widgets.debt.grid.contract', controlName: 'contract', type: 'text' },
            { label: 'widgets.debt.grid.creditStartDate', controlName: 'creditStartDate', type: 'text' },
            { label: 'widgets.debt.grid.creditEndDate', controlName: 'creditEndDate', type: 'text' },
            { label: 'widgets.debt.grid.regionCode', controlName: 'regionCode', type: 'text' },
            { label: 'widgets.debt.grid.branchCode', controlName: 'branchCode', type: 'text' },
          ]
        },
        {
          width: 6,
          children: [
            { label: 'widgets.debt.grid.debtReasonCode', controlName: 'debtReasonCode', type: 'text' },
            { label: 'widgets.debt.grid.startDate', controlName: 'startDate', type: 'text' },
            { label: 'widgets.debt.grid.dpd', controlName: 'dpd', type: 'text' },
            { label: 'widgets.debt.grid.currencyId', controlName: 'currencyId', type: 'text' },
            { label: 'widgets.debt.grid.debtSum', controlName: 'debtSum', type: 'text' },
            { label: 'widgets.debt.grid.totalSum', controlName: 'totalSum', type: 'text' },
            { label: 'widgets.debt.grid.dict1Code', controlName: 'dict1Code', type: 'text' },
            { label: 'widgets.debt.grid.dict2Code', controlName: 'dict2Code', type: 'text' },
            { label: 'widgets.debt.grid.dict3Code', controlName: 'dict3Code', type: 'text' },
            { label: 'widgets.debt.grid.dict4Code', controlName: 'dict4Code', type: 'text' },
          ]
        }
      ];
      this.debt = debt;
    });
  }

  public onSubmit(): void {
    const { value } = this.form;
    const data = {
      ...value,
      typeCode: Array.isArray(value.typeCode) ? value.typeCode[0].value : value.typeCode
    }

    const action = this.debtId
      ? this.debtService.update(this.id, this.debtId, data)
      : this.debtService.create(this.id, data);

    action.subscribe(() => this.onBack());
  }

  public onBack(): void {
    this.contentTabService.back();
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

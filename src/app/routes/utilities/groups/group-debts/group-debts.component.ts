import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IDynamicFormConfig, IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IGroup } from '../group.interface';
import { IGroupDebt } from './group-debts.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { GroupDebtsService } from './group-debts.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.groups.groupObjectDebts');

@Component({
  selector: 'app-group-debts',
  templateUrl: './group-debts.component.html',
  styleUrls: ['./group-debts.component.scss'],
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GroupDebtsComponent implements OnInit {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IGroupDebt>;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  groupId: number;
  rowCount = 0;
  rows: any[] = [];

  config: IDynamicFormConfig = {
    labelKey: 'widgets.groups.groupObjectDebts.filter'
  };

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private groupDebtsService: GroupDebtsService,
  ) { }

  ngOnInit(): void {
    this.controls = this.getControls();
  }

  onRequest(): void {

    if (this.groupId) {
      const filters = this.grid.getFilters();
      const params = this.grid.getRequestParams();

      this.groupDebtsService
        .fetch(this.groupId, filters, params)
        .subscribe((response: IAGridResponse<IGroupDebt>) => {
          this.rows = [...response.data];
          this.rowCount = response.total;
          this.cdRef.markForCheck();
        });
    }
  }

  onDblClick(debt: IGroupDebt): void {
    this.debtorCardService.openByDebtId(debt.debtId);
  }

  onSearch(): void {
    const { groups } = this.form.serializedUpdates;
    this.groupId = groups[0];
    this.onRequest();
  }

  private getControls(): IDynamicFormControl[] {
    return [
      {
        type: 'dialogmultiselectwrapper',
        controlName: 'groups',
        filterType: 'entityGroups',
        filterParams: { entityTypeId: 19, isManual: false },
        width: 5
      },
      {
        label: 'default.buttons.search',
        controlName: 'searchBtn',
        type: 'searchBtn',
        iconCls: 'fa-search',
        width: 3,
        action: () => this.onSearch()
      }
    ];
  }

}

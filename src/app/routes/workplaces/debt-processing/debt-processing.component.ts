import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IDebt } from './debt-processing.interface';
import { IAGridResponse, IAGridAction } from '../../../shared/components/grid2/grid2.interface';
import { IContextMenuItem } from '../../../shared/components/grid2/grid2.interface';
import { IActionGridDialogData } from '../../../shared/components/action-grid/action-grid.interface';

import { ContentTabService } from '../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtProcessingService } from './debt-processing.service';
import { DebtResponsibleService } from '../../../shared/gui-objects/widgets/debt-responsible/debt-responsible.service';
import { EntityGroupService } from '../../../shared/gui-objects/widgets/entity-group/entity-group.service';

import { ActionGridComponent } from '../../../shared/components/action-grid/action-grid.component';

import { DialogFunctions } from '../../../core/dialog';

@Component({
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
  styleUrls: [ './debt-processing.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtProcessingComponent extends DialogFunctions {
  static COMPONENT_NAME = 'DebtProcessingComponent';

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IDebt>;

  rows: IDebt[] = [];
  rowCount = 0;
  dialog: string;
  selectedDebts$ = new BehaviorSubject<IDebt[]>(null);

  contextMenuItems: IContextMenuItem[] = [
    {
      name: DebtResponsibleService.ACTION_DEBT_RESPONSIBLE_SET,
      enabled: this.debtResponsibleService.canSet$,
      action: action => this.selectedDebts$.value || this.selectedDebts$.next([action.params.node.data.debtId])
    },
    {
      name: DebtResponsibleService.ACTION_DEBT_RESPONSIBLE_CLEAR,
      enabled: this.debtResponsibleService.canClear$,
      action: action => this.selectedDebts$.value || this.selectedDebts$.next([action.params.node.data.debtId])
    },
    {
      name: EntityGroupService.ACTION_ENTITY_GROUP_ADD,
      enabled: this.entityGroupService.getCanAdd$(this.entityTypeId),
      action: (action: IAGridAction) => {
        if (!this.selectedDebts$.value) {
          this.selectedDebts$.next([action.params.node.data.debtId]);
        }
        Object.assign(action.action, { addOptions: [ { name: 'ids', value: this.selectedDebts$.value } ] });
      }
    }
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private debtProcessingService: DebtProcessingService,
    private debtResponsibleService: DebtResponsibleService,
    private entityGroupService: EntityGroupService,
    private router: Router,
    @Inject('entityTypeId') private entityTypeId: number,
  ) {
    super();
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.debtProcessingService.fetch(filters, params)
      .subscribe((response: IAGridResponse<IDebt>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onDblClick(debt: IDebt): void {
    const { personId, debtId } = debt;
    // log('debt', debt);
    this.contentTabService.removeTabByPath(`${this.router.url}\/[0-9]+$`);
    this.router.navigate([ `${this.router.url}/${personId}/${debtId}` ]);
  }

  onSelect(selectedDebts: IDebt[]): void {
    this.selectedDebts$.next(selectedDebts);
  }

  onAction({ action: { action }, params }: IActionGridDialogData): void {
    this.dialog = action.action;
    this.cdRef.markForCheck();
  }
}

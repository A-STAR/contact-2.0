import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IDebt } from '../debt-processing.interface';
import { IAGridResponse, IAGridAction } from '../../../../shared/components/grid2/grid2.interface';
import { IContextMenuItem } from '../../../../shared/components/grid2/grid2.interface';
import { IActionGridDialogData } from '../../../../shared/components/action-grid/action-grid.interface';

import { ContentTabService } from '../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtProcessingService } from '../debt-processing.service';
import { DebtResponsibleService } from '../../../../shared/gui-objects/widgets/debt-responsible/debt-responsible.service';
import { EntityGroupService } from '../../../../shared/gui-objects/widgets/entity-group/entity-group.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';

import { DialogFunctions } from '../../../../core/dialog';

@Component({
  selector: 'app-debt-processing-grid',
  templateUrl: './grid.component.html',
  styleUrls: [ './grid.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent extends DialogFunctions {
  @Input() gridKey: string;

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IDebt>;

  rows: IDebt[] = [];
  rowCount = 0;
  dialog: string;
  selectedDebts$ = new BehaviorSubject<IDebt[]>(null);

  contextMenuItems: IContextMenuItem[] = [
    {
      name: DebtResponsibleService.ACTION_DEBT_RESPONSIBLE_SET,
      enabled: this.canMakeAction(this.debtResponsibleService.canSet$)
    },
    {
      name: DebtResponsibleService.ACTION_DEBT_RESPONSIBLE_CLEAR,
      enabled: this.canMakeAction(this.debtResponsibleService.canClear$)
    },
    {
      name: EntityGroupService.ACTION_ENTITY_GROUP_ADD,
      enabled: this.canMakeAction(this.entityGroupService.getCanAdd$(this.entityTypeId)),
      onAction: (action: IAGridAction) => {
        const { metadataAction } = action;
        metadataAction.addOptions = [].concat({ name: 'ids', value: this.selectedDebts$.value });
        return action;
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

  canMakeAction(hasAccess$: Observable<boolean>): Observable<boolean> {
    return Observable.combineLatest(hasAccess$, this.selectedDebts$)
      .map(([ canClear, selected ]) => canClear && !!selected && selected.length > 0);
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.debtProcessingService.fetch(this.gridKey, filters, params)
      .subscribe((response: IAGridResponse<IDebt>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onDblClick(debt: IDebt): void {
    const { personId, debtId } = debt;
    this.contentTabService.removeTabByPath(`${this.router.url}\/[0-9]+$`);
    this.router.navigate([ `${this.router.url}/${personId}/${debtId}` ]);
  }

  onSelect(selectedDebts: IDebt[]): void {
    this.selectedDebts$.next(selectedDebts);
  }

  onAction({ action, params }: IActionGridDialogData): void {
    const { metadataAction } = action;
    this.dialog = metadataAction.action;
    this.cdRef.markForCheck();
  }
}

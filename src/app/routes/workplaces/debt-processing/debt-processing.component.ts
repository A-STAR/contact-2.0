import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { IDebt } from './debt-processing.interface';
import { IAGridResponse } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataAction } from '../../../core/metadata/metadata.interface';

import { ContentTabService } from '../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtProcessingService } from './debt-processing.service';

import { Grid2Component } from '../../../shared/components/grid2/grid2.component';
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

  @ViewChild(Grid2Component) grid: Grid2Component;

  rows: IDebt[] = [];
  rowCount = 0;
  dialog: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private debtProcessingService: DebtProcessingService,
    private router: Router,
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
    this.contentTabService.removeTabByPath(`${this.router.url}\/[0-9]+$`);
    this.router.navigate([ `${this.router.url}/${personId}/${debtId}` ]);
    // const { innerHeight: height, innerWidth: width} = window;
    // const winConfig =
    //  `menubar=no,location=no,resizable=yes,scrollbars=yes,modal=yes,status=no,height=${height},width=${width}`;
    // const win = window.open(`${this.router.url}/${debtId}`, '_blank', winConfig);
    // if (win.focus) { win.focus() };
  }

  onContextMenu(action: IMetadataAction): void {
    switch (action.action) {
      case 'debtSetResponsible': this.setDialog('debtResponsibleSet');
    }
  }

  getRowNodeId(debt: IDebt): number {
    return debt.debtId;
  }
}

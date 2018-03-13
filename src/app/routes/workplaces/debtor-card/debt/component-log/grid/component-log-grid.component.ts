import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IComponentLogEntry } from '../component-log.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ComponentLogService } from '../component-log.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-component-log-grid',
  templateUrl: './component-log-grid.component.html',
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentLogGridComponent implements OnInit {
  @Input() debtId: number;

  columns: Array<ISimpleGridColumn<IComponentLogEntry>> = [
    { prop: 'typeCode', minWidth: 150, maxWidth: 250, dictCode: UserDictionariesService.DICTIONARY_DEBT_COMPONENTS },
    { prop: 'amount', minWidth: 100, maxWidth: 250 },
    { prop: 'currency', minWidth: 100, maxWidth: 250, },
    { prop: 'fromDate', minWidth: 150, maxWidth: 250, renderer: DateRendererComponent },
    { prop: 'toDate', minWidth: 150, maxWidth: 250, renderer: DateRendererComponent },
    { prop: 'fullName', minWidth: 150 },
  ].map(addGridLabel('widgets.debt.componentLog.grid'));


  entries: IComponentLogEntry[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private componentLogService: ComponentLogService,
  ) {}

  ngOnInit(): void {

    this.componentLogService.readAll(this.debtId).subscribe(entries => {
      this.entries = entries;
      this.cdRef.markForCheck();
    });
  }
}

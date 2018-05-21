import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { IComponentLogEntry } from '../component-log.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ComponentLogService } from '../component-log.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';
import { first } from 'rxjs/operators/first';

@Component({
  selector: 'app-component-log-grid',
  templateUrl: './component-log-grid.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentLogGridComponent {
  @Input() set debtId(debtId: number) {
    if (this._debtId !== debtId) {
      this.fetch(debtId);
    }
  }

  columns: Array<ISimpleGridColumn<IComponentLogEntry>> = [
    { prop: 'typeCode', minWidth: 150, maxWidth: 250, dictCode: UserDictionariesService.DICTIONARY_DEBT_COMPONENTS },
    { prop: 'amount', minWidth: 100, maxWidth: 250 },
    { prop: 'currency', minWidth: 100, maxWidth: 250, },
    { prop: 'fromDate', minWidth: 150, maxWidth: 250, renderer: DateRendererComponent },
    { prop: 'toDate', minWidth: 150, maxWidth: 250, renderer: DateRendererComponent },
    { prop: 'fullName', minWidth: 150 },
  ].map(addGridLabel('widgets.debt.componentLog.grid'));


  entries: IComponentLogEntry[];

  private _debtId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private componentLogService: ComponentLogService,
  ) {}

  private fetch(debtId: number): void {
    if (debtId) {
      this.componentLogService
        .readAll(debtId)
        .pipe(first())
        .subscribe(entries => {
          this.entries = entries;
          this._debtId = debtId;
          this.cdRef.markForCheck();
        });
    }
  }
}

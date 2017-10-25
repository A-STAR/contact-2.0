import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { IComponentLogEntry } from '../component-log.interface';
import { IGridColumn, IRenderer } from '../../../../../components/grid/grid.interface';

import { ComponentLogService } from '../component-log.service';
import { GridService } from '../../../../../components/grid/grid.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-component-log-grid',
  templateUrl: './component-log-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentLogGridComponent {
  columns: Array<IGridColumn> = [
    { prop: 'typeCode', minWidth: 150, maxWidth: 250 },
    { prop: 'amount', minWidth: 100, maxWidth: 250 },
    { prop: 'currency', minWidth: 100, maxWidth: 250 },
    { prop: 'fromDate', minWidth: 150, maxWidth: 250 },
    { prop: 'toDate', minWidth: 150, maxWidth: 250 },
    { prop: 'fullName', minWidth: 150 },
  ];

  private renderers: IRenderer = {
    fromDate: 'dateTimeRenderer',
    toDate: 'dateTimeRenderer'
  };

  entries: Array<IComponentLogEntry>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private componentLogService: ComponentLogService,
    private gridService: GridService,
    private userDictionariesService: UserDictionariesService,
  ) {
    this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DEBT_COMPONENTS)
      .subscribe(options => {
        this.renderers.typeCode = [ ...options ];
        this.columns = this.gridService.setRenderers(this.columns, this.renderers);
        this.cdRef.markForCheck();
      });

    this.componentLogService.read(1).subscribe(entries => {
      this.entries = entries;
      this.cdRef.markForCheck();
    });
  }
}

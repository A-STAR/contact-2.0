import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IGenesysStatisticsRecord } from './statistics.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-genesys-statistics',
  templateUrl: 'statistics.component.html'
})
export class GenesysStatisticsComponent {

  @Input() statistics: IGenesysStatisticsRecord[];

  readonly columns: ISimpleGridColumn<IGenesysStatisticsRecord>[] = [
    { prop: 'total_chains' },
    { prop: 'complete' },
    { prop: 'processing' },
    { prop: 'postponed' },
    { prop: 'not_started' },
    { prop: 'errors' },
  ].map(addGridLabel('routes.utilities.campaigns.genesys.statistics.grid'));

  get rows(): IGenesysStatisticsRecord[] {
    return this.statistics
      ? this.statistics
      : [];
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.debtsProcessing');

@Component({
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtProcessingComponent {
  static COMPONENT_NAME = 'DebtProcessingComponent';

  grids = [
    { key: 'debtsprocessingall', title: label('all.title'), isInitialised: true },
    { key: 'debtsprocessingcallback', title: label('callBack.title'), isInitialised: false },
    { key: 'debtsprocessingcurrentjob', title: label('currentJob.title'), isInitialised: false },
  ];

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialised = true;
  }
}

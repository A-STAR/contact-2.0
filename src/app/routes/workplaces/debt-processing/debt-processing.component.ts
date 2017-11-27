import { ChangeDetectionStrategy, Component } from '@angular/core';

import { makeKey } from '../../../core/utils';

const labelKey = makeKey('modules.debtsProcessing');

@Component({
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtProcessingComponent {
  static COMPONENT_NAME = 'DebtProcessingComponent';

  grids = [
    { key: 'debtsprocessingall', title: labelKey('all.title') },
    { key: 'debtsprocessingcallback', title: labelKey('callBack.title') },
    { key: 'debtsprocessingcurrentjob', title: labelKey('currentJob.title') },
  ];
}

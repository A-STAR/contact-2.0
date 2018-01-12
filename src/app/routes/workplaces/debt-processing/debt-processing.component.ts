import { ChangeDetectionStrategy, Component } from '@angular/core';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.debtsProcessing');

@Component({
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtProcessingComponent {
  grids = [
    { key: 'debtsprocessingall', title: label('all.title'), isInitialised: true },
    { key: 'debtsprocessingcallback', title: label('callBack.title'), isInitialised: false },
    { key: 'debtsprocessingcurrentjob', title: label('currentJob.title'), isInitialised: false },
    { key: 'debtsprocessingvisits', title: label('visits.title'), isInitialised: false },
    { key: 'debtsprocessingpromisepay', title: label('promisePay.title'), isInitialised: false },
    { key: 'debtsprocessingpartpay', title: label('partPay.title'), isInitialised: false },
    { key: 'debtsprocessingproblem', title: label('problem.title'), isInitialised: false },
    { key: 'debtsprocessingreturn', title: label('returned.title'), isInitialised: false },
  ];

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialised = true;
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ITab } from '../../../shared/components/layout/tabview/header/header.interface';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.debtsProcessing');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
})
export class DebtProcessingComponent {
  tabs: ITab[] = [
    { link: 'all' },
    { link: 'callBack' },
    { link: 'currentJob' },
    { link: 'visits' },
    { link: 'promisePay' },
    { link: 'partPay' },
    { link: 'problem' },
    { link: 'returned' },
  ].map(tab => ({ ...tab, title: label(`${tab.link}.title`) }));
}

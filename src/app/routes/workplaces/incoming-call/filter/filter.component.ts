import { ChangeDetectionStrategy, Component } from '@angular/core';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.incomingCall.filter.form');

@Component({
  selector: 'app-incoming-call-filter',
  templateUrl: 'filter.component.html',
  styleUrls: [ 'filter.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  controls = [
    { label: labelKey('debtId'), controlName: 'debtId', type: 'text' },
    { label: labelKey('fullName'), controlName: 'fullName', type: 'text' },
    { label: labelKey('contract'), controlName: 'contract', type: 'text' },
    { label: labelKey('account'), controlName: 'account', type: 'text' },
    { label: labelKey('phoneNumber'), controlName: 'phoneNumber', type: 'text' },
    { label: labelKey('fullAddress'), controlName: 'fullAddress', type: 'text' },
    { label: labelKey('docSeries'), controlName: 'docSeries', type: 'text' },
    { label: labelKey('docNumber'), controlName: 'docNumber', type: 'text' },
    { label: labelKey('clientId'), controlName: 'clientId', type: 'text' },
    { label: labelKey('birthDate'), controlName: 'birthDate', type: 'datepicker' },
    { label: labelKey('showDebtors'), controlName: 'showDebtors', type: 'checkbox' },
    { label: labelKey('showGuarantors'), controlName: 'showGuarantors', type: 'checkbox' },
    { label: labelKey('showClosed'), controlName: 'showClosed', type: 'checkbox' },
  ];

  onSearchClick(): void {
    console.log('Click!');
  }
}

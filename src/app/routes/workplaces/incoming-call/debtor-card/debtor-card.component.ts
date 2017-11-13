import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { DebtorCardService } from './debtor-card.service';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.incomingCall.debtorCard.form');

@Component({
  selector: 'app-incoming-call-debtor-card',
  templateUrl: 'debtor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorCardComponent implements OnInit {
  controls = [
    { label: labelKey('userFullName'), controlName: 'userFullName', type: 'text' },
    { label: labelKey('organization'), controlName: 'organization ', type: 'text' },
    { label: labelKey('position'), controlName: 'position', type: 'text' },
    { label: labelKey('mobPhone'), controlName: 'mobPhone', type: 'text' },
    { label: labelKey('workPhone'), controlName: 'workPhone', type: 'text' },
    { label: labelKey('intPhone'), controlName: 'intPhone', type: 'text' },
    { label: labelKey('recommendation'), controlName: 'recommendation', type: 'text' },
  ];

  data = {};

  constructor(
    private debtorCardService: DebtorCardService,
  ) {}

  ngOnInit(): void {
    this.debtorCardService.fetch(1).subscribe(() => {});
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { DebtorCardService } from './debtor-card.service';
import { IncomingCallService } from '../incoming-call.service';

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
  ].map(control => ({ ...control, disabled: true }));

  data = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private incomingCallService: IncomingCallService,
  ) {}

  ngOnInit(): void {
    // TODO(d.maltsev): unsubscribing
    this.incomingCallService.selectedDebtor$
      .filter(Boolean)
      .subscribe(debtor => {
        this.debtorCardService.fetch(debtor.debtId).subscribe(data => {
          this.data = data;
          this.cdRef.markForCheck();
        });
      });
  }
}

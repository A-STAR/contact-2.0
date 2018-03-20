import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { DebtorCardService } from './debtor-card.service';
import { IncomingCallService } from '../incoming-call.service';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.incomingCall.debtorCard.form');

@Component({
  selector: 'app-incoming-call-debtor-card',
  templateUrl: 'debtor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorCardComponent implements AfterViewInit, OnDestroy {
  controls = [
    { label: labelKey('userFullName'), controlName: 'userFullName', type: 'text', width: 3 },
    { label: labelKey('organization'), controlName: 'organization', type: 'text', width: 3 },
    { label: labelKey('position'), controlName: 'position', type: 'text', width: 3 },
    { label: labelKey('mobPhone'), controlName: 'mobPhone', type: 'text', width: 3 },
    { label: labelKey('workPhone'), controlName: 'workPhone', type: 'text', width: 3 },
    { label: labelKey('intPhone'), controlName: 'intPhone', type: 'text', width: 3 },
    { label: labelKey('recommendation'), controlName: 'recommendation', type: 'text', width: 3 },
  ].map(control => ({ ...control, disabled: true }));

  data = {};

  private selectedDebtorSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private incomingCallService: IncomingCallService,
  ) {}

  ngAfterViewInit(): void {
    this.selectedDebtorSubscription = this.incomingCallService.selectedDebtor$
      .flatMap(debtor => debtor ? this.debtorCardService.fetch(debtor.debtId) : of(null))
      .subscribe(data => {
        this.data = data;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.selectedDebtorSubscription.unsubscribe();
  }
}

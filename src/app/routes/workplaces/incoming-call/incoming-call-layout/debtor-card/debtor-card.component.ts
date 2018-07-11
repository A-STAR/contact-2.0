import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { ITitlebar } from '@app/shared/components/titlebar/titlebar.interface';

import { DebtorCardService } from './debtor-card.service';
import { IncomingCallService } from '../../incoming-call.service';

import { makeKey } from '@app/core/utils';

const labelKey = makeKey('modules.incomingCall.debtorCard.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-incoming-call-debtor-card',
  templateUrl: 'debtor-card.component.html',
})
export class DebtorCardComponent implements AfterViewInit, OnDestroy {
  controls = [
    { label: labelKey('organization'), controlName: 'organization', type: 'text', width: 4 },
    { label: labelKey('position'), controlName: 'position', type: 'text', width: 4 },
    { label: labelKey('mobPhone'), controlName: 'mobPhone', type: 'text', width: 4 },
    { label: labelKey('workPhone'), controlName: 'workPhone', type: 'text', width: 4 },
    { label: labelKey('intPhone'), controlName: 'intPhone', type: 'text', width: 4 },
    { label: labelKey('recommendation'), controlName: 'recommendation', type: 'text', width: 4 },
  ].map(control => ({ ...control, disabled: true }));

  data: any = {};

  private selectedDebtorSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private incomingCallService: IncomingCallService,
    private translateService: TranslateService,
  ) {}

  ngAfterViewInit(): void {
    this.selectedDebtorSubscription = this.incomingCallService.selectedDebtor$
      .flatMap(debtor => debtor ? this.debtorCardService.fetch(debtor.debtId) : of({}))
      .subscribe(data => {
        this.data = data;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.selectedDebtorSubscription.unsubscribe();
  }

  get titlebar(): ITitlebar {
    const title = this.translateService.instant('routes.workplaces.incomingCall.operator.title');
    const { userFullName } = this.data;
    return {
      label: userFullName ? `${title}: ${userFullName}` : title,
    };
  }
}

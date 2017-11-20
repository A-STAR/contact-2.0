import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from './debtor-card.service';
import { IncomingCallService } from '../incoming-call.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.incomingCall.debtorCard.form');

@Component({
  selector: 'app-incoming-call-debtor-card',
  templateUrl: 'debtor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorCardComponent implements AfterViewInit {
  controls = [
    { label: labelKey('userFullName'), controlName: 'userFullName', type: 'text' },
    { label: labelKey('organization'), controlName: 'organization', type: 'text' },
    { label: labelKey('position'), controlName: 'position', type: 'text' },
    { label: labelKey('mobPhone'), controlName: 'mobPhone', type: 'text' },
    { label: labelKey('workPhone'), controlName: 'workPhone', type: 'text' },
    { label: labelKey('intPhone'), controlName: 'intPhone', type: 'text' },
    { label: labelKey('recommendation'), controlName: 'recommendation', type: 'text' },
  ].map(control => ({ ...control, disabled: true }));

  data = {};

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private incomingCallService: IncomingCallService,
  ) {}

  ngAfterViewInit(): void {
    // TODO(d.maltsev): unsubscribing
    this.incomingCallService.selectedDebtor$
      .flatMap(debtor => debtor ? this.debtorCardService.fetch(debtor.debtId) : Observable.of(null))
      .subscribe(data => {
        this.form.reset();
        this.data = data;
        this.cdRef.markForCheck();
      });
  }
}

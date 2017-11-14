import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { IncomingCallService } from '../incoming-call.service';

@Component({
  selector: 'app-incoming-call-phone-grid',
  templateUrl: 'phone-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridComponent implements OnInit {
  debtId = null;
  personId = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private incomingCallService: IncomingCallService,
  ) {}

  ngOnInit(): void {
    // TODO(d.maltsev): unsubscribing
    this.incomingCallService.selectedDebtor$
      .subscribe(debtor => {
        this.debtId = debtor ? debtor.debtId : null;
        this.personId = debtor ? debtor.personId : null;
        this.cdRef.markForCheck();
      });
  }
}

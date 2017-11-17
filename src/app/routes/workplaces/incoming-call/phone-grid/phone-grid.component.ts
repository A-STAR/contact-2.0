import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DebtService } from '../../../../core/debt/debt.service';
import { IncomingCallService } from '../incoming-call.service';

@Component({
  selector: 'app-incoming-call-phone-grid',
  templateUrl: 'phone-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridComponent implements OnInit, OnDestroy {
  debtId = null;
  personId = null;

  private selectedPhoneId: number;

  private debtorSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private incomingCallService: IncomingCallService,
  ) {}

  ngOnInit(): void {
    this.debtorSubscription = this.incomingCallService.selectedDebtor$
      .subscribe(debtor => {
        this.debtId = debtor ? debtor.debtId : null;
        this.personId = debtor ? debtor.personId : null;
        this.selectedPhoneId = null;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.debtorSubscription.unsubscribe();
  }

  get fullName$(): Observable<string> {
    return this.incomingCallService.selectedDebtor$.map(debtor => debtor && debtor.fullName);
  }

  get contactButtonDisabled(): boolean {
    return !this.selectedPhoneId;
  }

  get officeVisitButtonDisabled$(): Observable<boolean> {
    return this.debtService.canRegisterOfficeVisit$;
  }

  onSelect(phone: any): void {
    this.selectedPhoneId = phone.id;
  }

  onRegisterContact(): void {
    this.navigateToRegistration(1, this.selectedPhoneId);
  }

  onRegisterUnidentifiedContact(): void {
    this.navigateToRegistration(1, 0);
  }

  onRegisterOfficeVisit(): void {
    this.navigateToRegistration(8, 0);
  }

  private navigateToRegistration(contactType: number, contactId: number): void {
    this.incomingCallService.selectedDebtor$
      .take(1)
      .subscribe(debtor => {
        const { debtId, personId, personRole } = debtor;
        this.debtService.navigateToRegistration({ debtId, personId, personRole, contactType, contactId });
      });
  }
}

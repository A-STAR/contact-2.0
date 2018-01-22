import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IPhone } from '@app/routes/workplaces/shared/phone/phone.interface';

import { DebtService } from '../../../../core/debt/debt.service';
import { IncomingCallService } from '../incoming-call.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { invert } from '../../../../core/utils';
import { combineLatestAnd } from '../../../../core/utils/helpers';

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
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService,
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

  get contactType(): number {
    return 2;
  }

  get personRole(): number {
    return 1;
  }

  get fullName$(): Observable<string> {
    return this.incomingCallService.selectedDebtor$.map(debtor => debtor && debtor.fullName);
  }

  get contactButtonDisabled(): boolean {
    return !this.selectedPhoneId;
  }

  get unidentifiedContactButtonDisabled$(): Observable<boolean> {
    return this.incomingCallService.selectedDebtor$
      .map(Boolean)
      .map(invert);
  }

  get officeVisitButtonDisabled$(): Observable<boolean> {
    return combineLatestAnd([
      this.debtService.canRegisterOfficeVisit$,
      this.incomingCallService.selectedDebtor$.map(Boolean),
    ])
    .map(invert);
  }

  onSelect(phone: any): void {
    this.selectedPhoneId = phone.id;
  }

  onRegisterContact(): void {
    this.navigateToRegistration(1, this.selectedPhoneId);
  }

  onRegisterUnidentifiedContact(): void {
    this.navigateToRegistration(2, 0);
  }

  onRegisterOfficeVisit(): void {
    this.navigateToRegistration(8, 0);
  }

  onPhoneAdd(): void {
    this.routingService.navigate([ 'phone', 'create' ], this.route);
  }

  onPhoneEdit(phone: IPhone): void {
    this.routingService.navigate([ 'phone', `${phone.id}` ], this.route);
  }

  onPhoneRegister(phone: IPhone): void {
    const url = `/workplaces/contact-registration/${this.debtId}/${this.contactType}/${phone.id}`;
    this.router.navigate([ url ], { queryParams: {
      personId: this.personId,
      personRole: this.personRole,
    } });
  }

  private navigateToRegistration(contactType: number, contactId: number): void {
    this.incomingCallService.selectedDebtor$
      .pipe(first())
      .subscribe(debtor => {
        const { debtId, personId, personRole } = debtor;
        this.debtService.navigateToRegistration({ debtId, personId, personRole, contactType, contactId });
      });
  }
}

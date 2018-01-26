import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IPhone } from '@app/routes/workplaces/shared/phone/phone.interface';

import { ContactRegistrationService } from '../../shared/contact-registration/contact-registration.service';
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
    private contactRegistrationService: ContactRegistrationService,
    private debtService: DebtService,
    private incomingCallService: IncomingCallService,
    private route: ActivatedRoute,
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
    this.registerContact(this.contactType, this.selectedPhoneId);
  }

  onRegisterUnidentifiedContact(): void {
    this.registerContact(this.contactType);
  }

  onRegisterOfficeVisit(): void {
    this.registerContact(8);
  }

  onPhoneAdd(): void {
    this.routingService.navigate([ 'phone', 'create' ], this.route);
  }

  onPhoneEdit(phone: IPhone): void {
    this.routingService.navigate([ 'phone', `${phone.id}` ], this.route);
  }

  onPhoneRegister(phone: IPhone): void {
    this.registerContact(this.contactType, phone.id);
  }

  private registerContact(contactType: number, contactId: number = null): void {
    this.contactRegistrationService.startRegistration({
      contactId,
      contactType,
      debtId: this.debtId,
      personId: this.personId,
      personRole: this.personRole,
    });
  }
}

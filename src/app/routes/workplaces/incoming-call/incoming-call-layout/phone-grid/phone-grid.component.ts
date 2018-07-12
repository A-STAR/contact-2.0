import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';

import { ContactRegistrationService } from '../../../shared/contact-registration/contact-registration.service';
import { IncomingCallService } from '../../incoming-call.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { invert } from '@app/core/utils';
import { combineLatestAnd } from '@app/core/utils/helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-incoming-call-phone-grid',
  templateUrl: 'phone-grid.component.html',
})
export class PhoneGridComponent implements OnInit, OnDestroy {
  debtId = null;
  personId = null;
  personRole = null;

  readonly contactType = 2;
  readonly toolbar$ = this.incomingCallService.selectedDebtor$.pipe(
    map(debtor => {
      const title = this.translateService.instant('routes.workplaces.incomingCall.debtor.title');
      const { fullName } = debtor || {} as any;
      return {
        title: fullName ? `${title}: ${fullName}` : title,
      };
    }),
  );

  readonly unidentifiedContactButtonDisabled$ = this.incomingCallService.selectedDebtor$.pipe(
    map(Boolean),
    map(invert),
  );

  readonly officeVisitButtonDisabled$ = combineLatestAnd([
    this.workplacesService.canRegisterOfficeVisit$,
    this.incomingCallService.selectedDebtor$.map(Boolean),
  ]).pipe(
    map(isEnabled => !isEnabled)
  );

  private selectedPhoneId: number;

  private debtorSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private workplacesService: WorkplacesService,
    private incomingCallService: IncomingCallService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.debtorSubscription = this.incomingCallService.selectedDebtor$
      .subscribe(debtor => {
        this.debtId = debtor ? debtor.debtId : null;
        this.personId = debtor ? debtor.personId : null;
        this.personRole = debtor ? debtor.personRole : null;
        this.selectedPhoneId = null;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.debtorSubscription.unsubscribe();
  }

  get contactButtonDisabled(): boolean {
    return !this.selectedPhoneId;
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
    this.routingService.navigate([ `${this.personId}/phones/create` ], this.route);
  }

  onPhoneEdit(phone: IPhone): void {
    this.routingService.navigate([ `${this.personId}/phones/${phone.id}` ], this.route);
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

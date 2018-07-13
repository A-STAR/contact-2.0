import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { EntityType } from '@app/core/entity/entity.interface';
import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { IEmployment } from '@app/routes/workplaces/core/guarantee/guarantee.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';
import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';
import { ITitlebar } from '@app/shared/components/titlebar/titlebar.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PledgeCardEditContractService } from './edit-contract.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

import { editContractLayout } from './edit-contract.layout';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    PledgeCardEditContractService,
  ],
  selector: 'app-pledge-card-edit-contract',
  templateUrl: 'edit-contract.component.html'
})
export class PledgeCardEditContractComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @ViewChild('identification', { read: TemplateRef }) identificationTemplate: TemplateRef<any>;
  @ViewChild('employment',     { read: TemplateRef }) employmentTemplate:     TemplateRef<any>;
  @ViewChild('addresses',      { read: TemplateRef }) addressesTemplate:      TemplateRef<any>;
  @ViewChild('phones',         { read: TemplateRef }) phonesTemplate:         TemplateRef<any>;
  @ViewChild('emails',         { read: TemplateRef }) emailsTemplate:         TemplateRef<any>;
  @ViewChild('documents',      { read: TemplateRef }) documentsTemplate:      TemplateRef<any>;

  @ViewChild('contractTitlebar', { read: TemplateRef }) contractTitlebarTemplate:    TemplateRef<any>;
  @ViewChild('pledgorTitlebar',  { read: TemplateRef }) pledgorTitlebarTemplate:     TemplateRef<any>;
  @ViewChild('propertyTitlebar', { read: TemplateRef }) propertyTitlebarTemplate:    TemplateRef<any>;

  readonly layoutConfig = editContractLayout;

  readonly entityType = EntityType.PLEDGOR;

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contract ID (link between debtor, pledgor and property)
   */
  readonly contractId = Number(this.paramMap.get('contractId'));

  readonly debtId = Number(this.paramMap.get('debtId'));

  readonly debtorId = Number(this.paramMap.get('debtorId'));

  readonly pledgorId = Number(this.paramMap.get('pledgorId'));

  readonly pledgorRole = 3;

  readonly phoneContactType = 1;

  readonly propertyId = Number(this.paramMap.get('propertyId'));

  readonly contractTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.contract.title',
  };

  readonly pledgorTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.title',
  };

  readonly propertyTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.property.title',
  };

  readonly isSubmitDisabled$ = new BehaviorSubject<boolean>(false);

  templates: Record<string, TemplateRef<any>>;

  private subscriptionBag = new SubscriptionBag();

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private pledgeCardEditContractService: PledgeCardEditContractService,
    private personService: PersonService,
    private pledgeService: PledgeService,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService,
  ) {}

  ngOnInit(): void {
    this.templates = {
      identification: this.identificationTemplate,
      employment: this.employmentTemplate,
      addresses: this.addressesTemplate,
      phones: this.phonesTemplate,
      emails: this.emailsTemplate,
      documents: this.documentsTemplate,
      contractTitlebar: this.contractTitlebarTemplate,
      pledgorTitlebar: this.pledgorTitlebarTemplate,
      propertyTitlebar: this.propertyTitlebarTemplate,
    };
  }

  ngAfterViewInit(): void {
    this.fetchContract();
    this.fetchPledgor();
    this.fetchProperty();
    const disabledSubscription = this.layout.canSubmitAll().subscribe(isValid => this.isSubmitDisabled$.next(!isValid));
    this.subscriptionBag.add(disabledSubscription);
  }

  onSave(): void {
    const contract = this.layout.getData('contract');
    const pledgor = this.layout.getData();
    const property = this.layout.getData('property');
    const propertyValue = this.layout.getData('propertyValue');
    this.pledgeCardEditContractService
      .saveContract(this.debtId, this.contractId, this.pledgorId, this.propertyId, contract, pledgor, property, propertyValue)
      .subscribe(() => this.onSuccess());
  }

  onBack(): void {
    this.routingService.navigateToUrl('/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit');
  }

  onPhoneAdd(): void {
    this.router.navigate([ 'phone/create' ], { relativeTo: this.route });
  }

  onPhoneEdit(phone: IPhone): void {
    this.router.navigate([ `phone/${phone.id}` ], { relativeTo: this.route });
  }

  onPhoneRegister(phone: IPhone): void {
    this.contactRegistrationService.startRegistration({
      contactId: phone.id,
      contactType: this.phoneContactType,
      debtId: this.debtId,
      personId: this.pledgorId,
      personRole: this.pledgorRole,
    });
  }

  onAddressAdd(): void {
    this.router.navigate([ 'address/create' ], { relativeTo: this.route });
  }

  onAddressEdit(address: IAddress): void {
    this.router.navigate([ `address/${address.id}` ], { relativeTo: this.route });
  }

  onAddressRegister(address: IAddress): void {
    this.contactRegistrationService.startRegistration({
      contactId: address.id,
      contactType: 3,
      debtId: this.debtId,
      personId: this.pledgorId,
      personRole: this.pledgorRole,
    });
  }

  onIdentityAdd(): void {
    this.router.navigate([ 'identity/create' ], { relativeTo: this.route });
  }

  onIdentityEdit(document: IIdentityDoc): void {
    this.router.navigate([ `identity/${document.id}` ], { relativeTo: this.route });
  }

  onEmploymentAdd(): void {
    this.router.navigate([ 'employment/create' ], { relativeTo: this.route });
  }

  onEmploymentEdit(employment: IEmployment): void {
    this.router.navigate([ `employment/${employment.id}` ], { relativeTo: this.route });
  }

  private fetchContract(): void {
    this.pledgeService
      .fetch(this.debtId, this.contractId)
      .subscribe(contract => this.layout.setData({ contract }));
  }

  private fetchPledgor(): void {
    this.personService
      .fetch(this.pledgorId)
      .subscribe(pledgor => this.layout.setData({ default: pledgor }));
  }

  private fetchProperty(): void {
    this.propertyService
      .fetchForContract(this.debtId, this.contractId, this.propertyId)
      .subscribe(property => this.layout.setData({ property }));
  }

  private onSuccess(): void {
    this.pledgeService.dispatchPledgeSavedMessage();
    this.onBack();
  }
}

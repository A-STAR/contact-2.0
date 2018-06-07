import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { EntityType } from '@app/core/entity/entity.interface';
import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';
import { IEmployment } from '@app/routes/workplaces/core/employment/employment.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';
import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DYNAMIC_MODULES } from '@app/core/dynamic-loader/dynamic-loader.service';
import { LayoutService } from '@app/core/layout/layout.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PledgeCardService } from './pledge-card.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { editPledgeLayout } from './layout';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-pledge-card',
  templateUrl: 'pledge-card.component.html',
})
export class PledgeCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @ViewChild('identification', { read: TemplateRef }) identificationTemplate: TemplateRef<any>;
  @ViewChild('employment',     { read: TemplateRef }) employmentTemplate:     TemplateRef<any>;
  @ViewChild('addresses',      { read: TemplateRef }) addressesTemplate:      TemplateRef<any>;
  @ViewChild('phones',         { read: TemplateRef }) phonesTemplate:         TemplateRef<any>;
  @ViewChild('documents',      { read: TemplateRef }) documentsTemplate:      TemplateRef<any>;

  @ViewChild('contractTitlebar',    { read: TemplateRef }) contractTitlebarTemplate:    TemplateRef<any>;
  @ViewChild('contractClearButton', { read: TemplateRef }) contractClearButtonTemplate: TemplateRef<any>;
  @ViewChild('personTitlebar',      { read: TemplateRef }) personTitlebarTemplate:    TemplateRef<any>;
  @ViewChild('personClearButton',   { read: TemplateRef }) personClearButtonTemplate: TemplateRef<any>;
  @ViewChild('propertyTitlebar',    { read: TemplateRef }) propertyTitlebarTemplate:    TemplateRef<any>;
  @ViewChild('propertyClearButton', { read: TemplateRef }) propertyClearButtonTemplate: TemplateRef<any>;

  readonly layoutConfig = editPledgeLayout;

  readonly entityType = EntityType.PLEDGOR;

  readonly pledgor$ = this.pledgeCardService.pledgor$;
  readonly isPledgorFormDisabled$ = this.pledgor$.pipe(
    map(Boolean),
  );

  readonly property$ = this.pledgeCardService.property$;
  readonly isPropertyFormDisabled$ = this.property$.pipe(
    map(Boolean),
  );

  readonly formData$ = combineLatest(this.pledgor$, this.property$).pipe(
    map(([ person, property ]) => {
      return {
        default: person ? person : {},
        property: property ? property : {},
      };
    }),
  );

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contract ID (link between debtor, pledgor and property)
   */
  readonly contractId = Number(this.paramMap.get('contractId'));

  /**
   * Debt ID
   */
  readonly debtId = Number(this.paramMap.get('debtId'));

  /**
   * ID of person who is a debtor (displayed in debtor card)
   */
  readonly debtorId = Number(this.paramMap.get('debtorId'));

  /**
   * ID of person who is linked as pledgor via contractId
   */
  readonly pledgorId = Number(this.paramMap.get('pledgorId'));

  /**
   * Pledgor role (according to dictionary 44)
   */
  readonly pledgorRole = 3;

  readonly phoneContactType = 1;

  /**
   * ID of property that is linked via contractId
   */
  readonly propertyId = Number(this.paramMap.get('propertyId'));

  readonly createMode = !this.contractId;
  readonly addPledgorMode = !!this.contractId && !this.pledgorId;
  readonly addPropertyMode = !!this.pledgorId && !this.propertyId;
  readonly editMode = !!this.propertyId;

  readonly showContractForm = this.createMode || this.editMode;
  readonly showPledgorForm = this.createMode || this.addPledgorMode || this.editMode;

  readonly contractTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.contract.title',
  };

  readonly pledgorTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPersonSearch(),
        enabled: of(!this.editMode),
      },
    ]
  };

  readonly propertyTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.property.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPropertySearch(),
        enabled: of(!this.editMode),
      },
    ]
  };

  readonly isSubmitDisabled$ = new BehaviorSubject<boolean>(false);

  private subscription = new Subscription();

  templates: Record<string, TemplateRef<any>>;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private injector: Injector,
    private layoutService: LayoutService,
    private personService: PersonService,
    private pledgeCardService: PledgeCardService,
    private pledgeService: PledgeService,
    private popupOutletService: PopupOutletService,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DYNAMIC_MODULES) private modules: IDynamicModule[][],
  ) {}

  ngOnInit(): void {
    this.templates = {
      identification: this.identificationTemplate,
      employment: this.employmentTemplate,
      addresses: this.addressesTemplate,
      phones: this.phonesTemplate,
      documents: this.documentsTemplate,
      contractTitlebar: this.contractTitlebarTemplate,
      contractClearButton: this.contractClearButtonTemplate,
      personTitlebar: this.personTitlebarTemplate,
      personClearButton: this.personClearButtonTemplate,
      propertyTitlebar: this.propertyTitlebarTemplate,
      propertyClearButton: this.propertyClearButtonTemplate,
    };

    const pledgorSubscription = this.pledgor$.subscribe(person => {
      if (person) {
        this.layout.disableFormGroup();
      } else {
        this.layout.enableFormGroup();
      }
    });
    this.subscription.add(pledgorSubscription);

    const propertySubscription = this.property$.subscribe(property => {
      if (property) {
        this.layout.disableFormGroup('property');
      } else {
        this.layout.enableFormGroup('property');
      }
    });
    this.subscription.add(propertySubscription);

    // One of many reasons route reuse is inconvenient
    if (this.createMode) {
      const routerSubscription = this.layoutService.navigationEnd$.subscribe(() => {
        this.layout.resetForm();
        this.layout.resetForm('contract');
        this.layout.resetForm('property');
      });
      this.subscription.add(routerSubscription);
    }
  }

  ngAfterViewInit(): void {
    if (this.contractId) {
      this.fetchContract();
    }
    if (this.pledgorId) {
      this.fetchPledgor();
    }
    if (this.propertyId) {
      this.fetchProperty();
    }

    const subscription = this.layout.canSubmitAll().subscribe(canSubmit => this.isSubmitDisabled$.next(!canSubmit));
    this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get title(): string {
    switch (true) {
      case this.createMode:
        return 'routes.workplaces.debtorCard.pledge.card.titles.add';
      case this.addPledgorMode:
        return 'routes.workplaces.debtorCard.pledge.card.titles.addPledgor';
      case this.addPropertyMode:
        return 'routes.workplaces.debtorCard.pledge.card.titles.addProperty';
      default:
        return 'routes.workplaces.debtorCard.pledge.card.titles.edit';
    }
  }

  onContactFormClear(): void {
    const isDisabled = this.layout.isFormDisabled('contract');
    this.layout.resetForm('contract');
    if (isDisabled) {
      this.layout.disableFormGroup('contract');
    }
  }

  onPersonFormClear(): void {
    const isDisabled = this.layout.isFormDisabled();
    this.pledgeCardService.selectPledgor(null);
    this.layout.resetForm();
    if (isDisabled) {
      this.layout.disableFormGroup();
    }
  }

  onPropertyFormClear(): void {
    const isDisabled = this.layout.isFormDisabled('property');
    this.pledgeCardService.selectProperty(null);
    this.layout.resetForm('property');
    if (isDisabled) {
      this.layout.disableFormGroup('property');
    }
  }

  onSave(): void {
    const contractData = this.layout.getData('contract');
    const pledgorData = this.layout.getData();
    const propertyData = this.layout.getData('property');

    if (this.createMode) {
      this.pledgeCardService
        .createPledge(this.debtId, this.pledgorId, this.propertyId, contractData, pledgorData, propertyData)
        .subscribe(() => this.onSuccess());
    }
    if (this.addPledgorMode) {
      this.pledgeCardService
        .addPledgor(this.debtId, this.contractId, this.pledgorId, this.propertyId, pledgorData, propertyData)
        .subscribe(() => this.onSuccess());
    }
    if (this.addPropertyMode) {
      this.pledgeCardService
        .addProperty(this.debtId, this.contractId, this.pledgorId, this.propertyId, propertyData)
        .subscribe(() => this.onSuccess());
    }
    if (this.editMode) {
      this.pledgeCardService
        .updatePledge(this.debtId, this.contractId, this.pledgorId, this.propertyId, contractData, pledgorData, propertyData)
        .subscribe(() => this.onSuccess());
    }
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.router.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
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
      .fetch(this.pledgorId, this.propertyId)
      .subscribe(property => this.layout.setData({ property }));
  }

  private onSuccess(): void {
    this.pledgeService.dispatchPledgeSavedMessage();
    this.onBack();
  }

  private openPersonSearch(): void {
    this.popupOutletService.open(this.modules, 'select-person', this.injector);
  }

  private openPropertySearch(): void {
    this.popupOutletService.open(this.modules, 'select-property', this.injector);
  }
}

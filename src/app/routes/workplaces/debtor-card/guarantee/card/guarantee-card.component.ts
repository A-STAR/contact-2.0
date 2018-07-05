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
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { first, map, mapTo, mergeMap } from 'rxjs/operators';
import { isEmpty } from 'ramda';

import { EntityType } from '@app/core/entity/entity.interface';
import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';
import { IEmployment } from '@app/routes/workplaces/core/guarantee/guarantee.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';
import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DYNAMIC_MODULES } from '@app/core/dynamic-loader/dynamic-loader.service';
import { GuaranteeCardService } from './guarantee-card.service';
import { GuaranteeService } from '@app/routes/workplaces/core/guarantee/guarantee.service';
import { LayoutService } from '@app/core/layout/layout.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { invert } from '@app/core/utils';

import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

import { editLayout, createContractLayout, createGuarantorLayout } from './layout';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-guarantee-card',
  templateUrl: 'guarantee-card.component.html',
})
export class GuarantorCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @ViewChild('identification', { read: TemplateRef }) identificationTemplate: TemplateRef<any>;
  @ViewChild('employment',     { read: TemplateRef }) employmentTemplate:     TemplateRef<any>;
  @ViewChild('addresses',      { read: TemplateRef }) addressesTemplate:      TemplateRef<any>;
  @ViewChild('phones',         { read: TemplateRef }) phonesTemplate:         TemplateRef<any>;
  @ViewChild('emails',         { read: TemplateRef }) emailsTemplate:         TemplateRef<any>;
  @ViewChild('documents',      { read: TemplateRef }) documentsTemplate:      TemplateRef<any>;

  @ViewChild('contractTitlebar',    { read: TemplateRef }) contractTitlebarTemplate:    TemplateRef<any>;
  @ViewChild('contractClearButton', { read: TemplateRef }) contractClearButtonTemplate: TemplateRef<any>;
  @ViewChild('personTitlebar',      { read: TemplateRef }) personTitlebarTemplate:      TemplateRef<any>;
  @ViewChild('personClearButton',   { read: TemplateRef }) personClearButtonTemplate:   TemplateRef<any>;

  readonly entityType = EntityType.GUARANTOR;

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contract ID (link between debtor and guarantor)
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
   * ID of person who is linked to the debtor as guarantor via contractId
   */
  readonly guarantorId = Number(this.paramMap.get('guarantorId'));

  /**
   * Guarantor role (according to dictionary 44)
   */
  readonly guarantorRole = 2;

  readonly phoneContactType = 1;

  readonly editing = Boolean(this.guarantorId);

  readonly guarantor$ = this.guaranteeCardService.guarantor$;

  readonly formData$ = this.guarantor$.pipe(
    map(person => person ? { default: person } : {}),
  );

  readonly isGuarantorFormDisabled$ = this.guarantor$.pipe(
    map(Boolean),
  );

  readonly edit$ = this.route.data.pipe(
    map(data => data.edit),
  );

  readonly showContractForm$ = this.route.data.pipe(
    map(data => data.showContractForm),
  );

  readonly showContractForm = this.route.snapshot.data.showContractForm;

  readonly contractTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.guarantee.card.forms.contract.title',
  };

  readonly personTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.guarantee.card.forms.guarantor.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPersonSearch(),
        enabled: this.edit$.pipe(map(invert)),
      },
    ]
  };

  readonly isSubmitDisabled$ = new BehaviorSubject<boolean>(false);

  readonly layoutConfig = this.getLayout();

  private subscription = new SubscriptionBag();

  templates: Record<string, TemplateRef<any>>;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private guaranteeCardService: GuaranteeCardService,
    private guaranteeService: GuaranteeService,
    private injector: Injector,
    private layoutService: LayoutService,
    private personService: PersonService,
    private popupOutletService: PopupOutletService,
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
      emails: this.emailsTemplate,
      documents: this.documentsTemplate,
      contractTitlebar: this.contractTitlebarTemplate,
      contractClearButton: this.contractClearButtonTemplate,
      personTitlebar: this.personTitlebarTemplate,
      personClearButton: this.personClearButtonTemplate,
    };

    const subscription = this.guarantor$.subscribe(person => {
      if (person) {
        this.layout.disableFormGroup();
      } else {
        this.layout.enableFormGroup();
      }
    });
    this.subscription.add(subscription);

    // One of many reasons route reuse is inconvenient
    if (!this.editing) {
      const routerSubscription = this.layoutService.navigationEnd$.subscribe(() => this.layout.resetAndEnableAll());
      this.subscription.add(routerSubscription);
    }
  }

  ngAfterViewInit(): void {
    if (this.editing) {
      this.guaranteeService
        .fetch(this.debtId, this.contractId)
        .subscribe(response => {
          const { personIds, ...contract } = response;
          this.layout.setData({ contract });
        });
      this.personService
        .fetch(this.guarantorId)
        .subscribe(guarantor => {
          this.layout.setData({ default: guarantor });
        });
    }

    const subscription = this.editing || !this.showContractForm
      ? this.layout.canSubmitAll().subscribe(canSubmit => this.isSubmitDisabled$.next(!canSubmit))
      : combineLatest(
          this.guarantor$,
          this.layout.canSubmit(),
          this.layout.canSubmit('contract'),
        )
        .subscribe(([ guarantor, canSubmitGuarantor, canSubmitContract ]) => {
          const canSubmit = (guarantor || canSubmitGuarantor) && canSubmitContract;
          this.isSubmitDisabled$.next(!canSubmit);
        });
      this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onContractFormClear(): void {
    const isDisabled = this.layout.isFormDisabled('contract');
    this.layout.resetForm('contract');
    if (isDisabled) {
      this.layout.disableFormGroup('contract');
    }
  }

  onPersonFormClear(): void {
    const isDisabled = this.layout.isFormDisabled();
    this.guaranteeCardService.selectGuarantor(null);
    this.layout.resetForm();
    if (isDisabled) {
      this.layout.disableFormGroup();
    }
  }

  onSave(): void {
    this.guarantor$
      .pipe(
        first(),
        mergeMap(selectedGuarantor => {
          return selectedGuarantor
            ? of (selectedGuarantor.id)
            : this.saveGuarantor();
        }),
        mergeMap(guarantorId => this.saveContract(guarantorId))
      ).subscribe(() => this.onSuccess());
  }

  onSuccess(): void {
    this.guaranteeService.dispatchGuarantorSavedMessage();
    this.onBack();
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.router.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}/edit` ], { relativeTo: this.route });
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
      personId: this.guarantorId,
      personRole: this.guarantorRole,
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
      personId: this.guarantorId,
      personRole: this.guarantorRole,
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

  private saveContract(guarantorId: number): Observable<void> {
    if (!this.showContractForm) {
      return this.guaranteeService.addGuarantor(this.debtId, this.contractId, guarantorId);
    }
    const data = this.layout.getData('contract');
    if (isEmpty(data)) {
      return of(null);
    }
    return this.contractId
      ? this.guaranteeService.update(this.debtId, this.contractId, data)
      : this.guaranteeService.create(this.debtId, { ...data, personId: guarantorId });
  }

  private saveGuarantor(): Observable<number> {
    const data = this.layout.getData();
    if (isEmpty(data)) {
      return of(null);
    }
    return this.guarantorId
      ? this.personService.update(this.guarantorId, data).pipe(mapTo(this.guarantorId))
      : this.personService.create(data);
  }

  private openPersonSearch(): void {
    this.popupOutletService.open(this.modules, 'select-person', this.injector);
  }

  private getLayout(): IDynamicLayoutConfig {
    if (this.editing) {
      return editLayout;
    } else {
      return this.showContractForm
        ? createContractLayout
        : createGuarantorLayout;
    }
  }
}

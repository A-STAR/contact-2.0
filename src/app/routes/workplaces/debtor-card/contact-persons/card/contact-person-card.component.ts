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
import { of } from 'rxjs/observable/of';
import { first, map, mapTo, mergeMap } from 'rxjs/operators';

import { EntityType } from '@app/core/entity/entity.interface';
import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';
import { IEmployment } from '@app/routes/workplaces/core/guarantee/guarantee.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';
import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';
import { ITitlebar } from '@app/shared/components/titlebar/titlebar.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { ContactPersonCardService } from './contact-person-card.service';
import { ContactPersonsService } from '@app/routes/workplaces/core/contact-persons/contact-persons.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DYNAMIC_MODULES } from '@app/core/dynamic-loader/dynamic-loader.service';
import { LayoutService } from '@app/core/layout/layout.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { invert } from '@app/core/utils';

import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

import { createContactPersonLayout, editContactPersonLayout } from './layout';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-contact-person-card',
  templateUrl: 'contact-person-card.component.html',
})
export class ContactPersonCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @ViewChild('identification', { read: TemplateRef }) identificationTemplate: TemplateRef<any>;
  @ViewChild('employment',     { read: TemplateRef }) employmentTemplate:     TemplateRef<any>;
  @ViewChild('addresses',      { read: TemplateRef }) addressesTemplate:      TemplateRef<any>;
  @ViewChild('phones',         { read: TemplateRef }) phonesTemplate:         TemplateRef<any>;
  @ViewChild('emails',         { read: TemplateRef }) emailsTemplate:         TemplateRef<any>;
  @ViewChild('documents',      { read: TemplateRef }) documentsTemplate:      TemplateRef<any>;

  @ViewChild('personTitlebar',    { read: TemplateRef }) personTitlebarTemplate:    TemplateRef<any>;
  @ViewChild('personClearButton', { read: TemplateRef }) personClearButtonTemplate: TemplateRef<any>;

  readonly entityType = EntityType.PERSON;

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Debt ID
   */
  readonly debtId = Number(this.paramMap.get('debtId'));

  /**
   * ID of person who is a debtor (displayed in debtor card)
   */
  readonly debtorId = Number(this.paramMap.get('debtorId'));

  /**
   * ID of person who is linked to the debtor as contact person via contactId
   */
  readonly personId = Number(this.paramMap.get('personId'));

  /**
   * Contact Person role (according to dictionary 44)
   */
  readonly contactPersonRole = 4;

  readonly editing = this.route.snapshot.data.edit;

  readonly contactPerson$ = this.contactPersonCardService.contactPerson$;

  readonly edit$ = this.route.data.pipe(
    map(data => data.edit),
  );

  readonly showContractForm$ = this.route.data.pipe(
    map(data => data.showContractForm),
  );

  readonly layoutConfig = this.editing
    ? editContactPersonLayout
    : createContactPersonLayout;

  readonly contactPersonTitlebar: ITitlebar = {
    title: 'routes.workplaces.debtorCard.contactPerson.card.forms.contactPerson.title',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.SEARCH,
        action: () => this.openPersonSearch(),
        enabled: this.edit$.pipe(map(invert)),
      },
    ]
  };

  readonly formData$ = this.contactPerson$.pipe(
    map(person => {
      if (person) {
        const { linkTypeCode, ...rest } = person;
        if (linkTypeCode) {
          return { default: rest, link: { linkTypeCode } };
        } else {
          return { default: rest };
        }
      } else {
        return { default: {}, link: {} };
      }
    }),
  );

  readonly isSubmitDisabled$ = new BehaviorSubject<boolean>(false);

  private subscription = new SubscriptionBag();

  readonly phoneContactType = 1;

  templates: Record<string, TemplateRef<any>>;

  constructor(
    private contactPersonCardService: ContactPersonCardService,
    private contactPersonsService: ContactPersonsService,
    private contactRegistrationService: ContactRegistrationService,
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
      personTitlebar: this.personTitlebarTemplate,
      personClearButton: this.personClearButtonTemplate,
    };

    const subscription = this.contactPerson$.subscribe(person => {
      if (person) {
        this.layout.disableFormGroup();
      } else {
        this.layout.enableFormGroup();
      }
    });
    this.subscription.add(subscription);

    // One of many reasons route reuse is inconvenient
    if (!this.editing) {
      const routerSubscription = this.layoutService.navigationEnd$.subscribe(() => {
        this.layout.resetAndEnableAll();
        this.isSubmitDisabled$.next(true);
      });
      this.subscription.add(routerSubscription);
    }
  }

  ngAfterViewInit(): void {
    if (this.editing) {
      this.contactPersonsService
        .fetch(this.debtorId, this.personId)
        .subscribe(person => {
          const { linkTypeCode, ...rest } = person;
          this.layout.setData({ default: rest, link: { linkTypeCode } });
        });
    }
    const subscription = this.layout
      .canSubmitAll(!this.editing)
      .subscribe(canSubmit => this.isSubmitDisabled$.next(!canSubmit));
    this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onContactPersonFormClear(): void {
    const isDefaultFormDisabled = this.layout.isFormDisabled();
    this.contactPersonCardService.selectContactPerson(null);
    this.layout.resetForm();
    this.layout.resetForm('link');
    if (isDefaultFormDisabled) {
      this.layout.disableFormGroup();
    }
  }

  onSave(): void {
    this.contactPerson$
      .pipe(
        first(),
        mergeMap(selectedPerson => {
          if (selectedPerson) {
            return of(selectedPerson.id).pipe(first());
          }
          const person = this.layout.getData();
          return this.editing
            ? this.personService.update(this.personId, person).pipe(mapTo(this.personId))
            : this.personService.create(person);
        }),
      )
      .subscribe(personId => {
        const { linkTypeCode } = this.layout.getData('link');
        if (linkTypeCode) {
          if (this.editing) {
            this.contactPersonsService
              .update(this.debtorId, this.personId, { linkTypeCode })
              .subscribe(() => this.onSuccess());
          } else {
            this.contactPersonsService
              .create(this.debtorId, { contactId: personId, linkTypeCode })
              .subscribe(() => this.onSuccess());
          }
        } else {
          this.onSuccess();
        }
      });
  }

  onSuccess(): void {
    this.contactPersonsService.dispatchContactPersonSavedMessage();
    this.onBack();
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.router.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}/edit` ]);
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
      personId: this.personId,
      personRole: this.contactPersonRole,
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
      personId: this.personId,
      personRole: this.contactPersonRole,
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

  private openPersonSearch(): void {
    this.popupOutletService.open(this.modules, 'select-person', this.injector);
  }
}

import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IAddress } from '@app/routes/workplaces/shared/address/address.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IContact, IContactLink } from '@app/routes/workplaces/core/contact-persons/contact-persons.interface';
import { IEmployment } from '@app/routes/workplaces/core/employment/employment.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';
import { IPhone } from '@app/routes/workplaces/shared/phone/phone.interface';
import { IPerson } from './person-select/person-select.interface';

import { ContactPersonsService } from '@app/routes/workplaces/core/contact-persons/contact-persons.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { PersonSelectGridComponent } from './person-select/grid/person-select-grid.component';
import { PersonSelectCardComponent } from './person-select/card/person-select-card.component';

import { makeKey } from '@app/core/utils';
const label = makeKey('widgets.contact.grid');

@Component({
  host: { class: 'full-size' },
  selector: 'app-contact-persons-card',
  templateUrl: './contact-persons-card.component.html'
})
export class ContactPersonsCardComponent implements OnInit {
  @Input() contactId: number;
  @Input() personId: number;

  @ViewChild(PersonSelectGridComponent) personSelectGrid: PersonSelectGridComponent;
  @ViewChild(PersonSelectCardComponent) personSelectCard: PersonSelectCardComponent;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  contact: IContact;

  tabs = [
    { title: 'debtor.information.phone.title', isInitialised: true },
    { title: 'debtor.information.address.title', isInitialised: true },
    { title: 'debtor.identityDocs.title', isInitialised: false },
    { title: 'debtor.employmentRecordTab.title', isInitialised: false }
  ];

  constructor(
    private contactPersonsService: ContactPersonsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.contactId
        ? this.userPermissionsService.has('CONTACT_PERSON_EDIT')
        : this.userPermissionsService.has('CONTACT_PERSON_ADD'),
      this.contactId ? this.contactPersonsService.fetch(this.personId, this.contactId) : of(null)
    )
    .pipe(first())
    .subscribe(([ canEdit, contact ]) => {
      this.contact = contact;
      this.controls = [
        {
          label: label('linkTypeCode'),
          controlName: 'linkTypeCode',
          type: 'select',
          dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE,
          disabled: !canEdit,
          width: 4
        },
      ];
    });

  }

  get canSubmit(): boolean {
    const forms = [ this.form, this.personSelectGrid, this.personSelectCard ].filter(Boolean);
    return !!this.contactId && forms.find(form => form.canSubmit)
      && forms.every(form => form.isValid);
  }

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get debtorId(): number {
    return this.routeParams.personId;
  }

  onAddressAdd(): void {
    this.routingService.navigate([
      this.contact
        ? 'address/create'
        : `${this.contactId}/address/create`
    ], this.route);
  }

  onAddressEdit(address: IAddress): void {
    this.routingService.navigate([
      this.contact
        ? `address/${address.id}`
        : `${this.contactId}/address/${address.id}`
    ], this.route);
  }

  onPhoneAdd(): void {
    this.routingService.navigate([
      this.contact
        ? 'phone/create'
        : `${this.contactId}/phone/create`
    ], this.route);
  }

  onPhoneEdit(phone: IPhone): void {
    this.routingService.navigate([
      this.contact
        ? `phone/${phone.id}`
        : `${this.contactId}/phone/${phone.id}`
    ], this.route);
  }

  onIdentityAdd(): void {
    this.routingService.navigate([
      this.contact
        ? 'identity/create'
        : `${this.contactId}/identity/create`
    ], this.route);
  }

  onIdentityEdit(doc: IIdentityDoc): void {
    this.routingService.navigate([
      this.contact
        ? `identity/${doc.id}`
        : `${this.contactId}/identity/${doc.id}`
    ], this.route);
  }

  onEmploymentAdd(): void {
    this.routingService.navigate([
      this.contact
        ? 'employment/create'
        : `${this.contactId}/employment/create`
    ], this.route);
  }

  onEmploymentEdit(employment: IEmployment): void {
    this.routingService.navigate([
      this.contact
        ? `employment/${employment.id}`
        : `${this.contactId}/employment/${employment.id}`
    ], this.route);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onContactSelected(contact: IPerson): void {
    this.contactId = contact.id;
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    this.routingService.navigate([ `/workplaces/debtor-card/${debtId}` ]);
  }

  onSubmit(): void {
    this.createContact({
      contactPersonId: this.contactId,
      linkTypeCode: this.form.serializedValue.linkTypeCode
    });
    this.onBack();
  }

  private createContact(contactLink: IContactLink): void {
    const action = this.contact
      ? this.personSelectCard.submitPerson()
        .flatMap(() => this.contactPersonsService.update(this.personId, this.contactId, contactLink))
      : this.contactPersonsService.create(this.personId, contactLink);

    action.subscribe(() => {
      this.contactPersonsService.dispatchAction(ContactPersonsService.MESSAGE_CONTACT_SAVED);
    });
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }

}

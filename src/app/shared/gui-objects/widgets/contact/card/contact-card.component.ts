import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IAddress } from '@app/routes/workplaces/shared/address/address.interface';
import { IContact, IContactLink } from '@app/shared/gui-objects/widgets/contact/contact.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPhone } from '@app/routes/workplaces/shared/phone/phone.interface';
import { IPerson } from 'app/shared/gui-objects/widgets/person-select/person-select.interface';

import { ContactService } from '@app/shared/gui-objects/widgets/contact/contact.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { PersonSelectGridComponent } from '@app/shared/gui-objects/widgets/person-select/grid/person-select-grid.component';
import { PersonSelectCardComponent } from '@app/shared/gui-objects/widgets/person-select/card/person-select-card.component';

import { makeKey } from '@app/core/utils';
const label = makeKey('widgets.contact.grid');

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html'
})
export class ContactCardComponent implements OnInit {
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

  private _selectedContact$ = new BehaviorSubject<IPerson>(null);

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.contactId
        ? this.userPermissionsService.has('CONTACT_PERSON_EDIT')
        : this.userPermissionsService.has('CONTACT_PERSON_ADD'),
      this.contactId ? this.contactService.fetch(this.personId, this.contactId) : of(null)
    )
    .pipe(first())
    .subscribe(([ canEdit, contact ]) => {
      this.contact = contact;
      this.controls = [
        {
          label: label('linkTypeCode'),
          controlName: 'linkTypeCode',
          type: 'selectwrapper',
          dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE,
          disabled: !canEdit
        },
      ];
    });

    this.selectedContact$
      .filter(Boolean)
      .subscribe(contact => this.selectContact(contact.id));
  }

  get canSubmit(): boolean {
    return !!this._selectedContact$.value || (this.form && this.form.canSubmit) ||
      (this.personSelectCard && this.personSelectCard.isValid);
  }

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get debtorId(): number {
    return this.routeParams.personId;
  }

  get selectedContactId(): number {
    return this._selectedContact$.value && this._selectedContact$.value.id;
  }

  get selectedContact$(): Observable<IPerson> {
    return this.personSelectCard
      ? this.personSelectCard.submitPerson()
      : this._selectedContact$;
  }

  get contactPersonId(): number {
    return this.contactId || this.personId || this.selectedContactId;
  }

  onAddressAdd(): void {
    this.routingService.navigate([ 'address/create' ], this.route);
  }

  onAddressEdit(address: IAddress): void {
    this.routingService.navigate([ `address/${address.id}` ], this.route);
  }

  onPhoneAdd(): void {
    this.routingService.navigate([ 'phone/create' ], this.route);
  }

  onPhoneEdit(phone: IPhone): void {
    this.routingService.navigate([ `phone/${phone.id}` ], this.route);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onContactSelected(contact: IPerson): void {
    this._selectedContact$.next(contact);
  }

  onBack(): void {
    this.routingService.navigate([
      '/workplaces',
      'debtor-card',
      this.route.snapshot.paramMap.get('debtId')
    ]);
  }

  onSubmit(): void {
    this.selectedContact$.subscribe(contact => this.createContact({
      contactPersonId: contact.id,
      linkTypeCode: this.form.serializedValue.linkTypeCode
    }));
    this.onBack();
  }

  private createContact(contactLink: IContactLink): void {
    const action = this.contactId
      ? this.contactService.update(this.personId, this.contactId, contactLink)
      : this.contactService.create(this.personId, contactLink);

    action.subscribe(() => {
      this.contactService.dispatchAction(ContactService.MESSAGE_CONTACT_SAVED);
    });
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }

  private selectContact(contactId: number): void {
    this.routingService.navigate([ `/workplaces/debtor-card/${this.debtId}/contact/create/${contactId}` ]);
  }
}

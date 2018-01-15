import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IContact, IContactLink } from '../contact.interface';
import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPerson } from 'app/shared/gui-objects/widgets/person-select/person-select.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContactService } from '../contact.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from 'app/shared/components/form/dynamic-form/dynamic-form.component';
import { PersonSelectGridComponent } from 'app/shared/gui-objects/widgets/person-select/grid/person-select-grid.component';
import { PersonSelectCardComponent } from 'app/shared/gui-objects/widgets/person-select/card/person-select-card.component';

import { makeKey } from '../../../../../core/utils';

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

  private routeUrl: string;

  private canEdit: boolean;

  constructor(
    private contentTabService: ContentTabService,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
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
      this.canEdit = canEdit;
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

    this.routeUrl = this.router.url;
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
    return this.routeParams.contactId || this.routeParams.personId || this.selectedContactId;
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onContactSelected(contact: IPerson): void {
    this._selectedContact$.next(contact);
  }

  onBack(): void {
    this.contentTabService.back();
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
    this.router.navigate([ this.routeUrl ])
      .then(() => this.router.navigate([ `${this.routeUrl}/${contactId}` ]));
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IContactPerson } from '@app/routes/workplaces/core/contact-persons/contact-persons.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ContactPersonsService } from '@app/routes/workplaces/core/contact-persons/contact-persons.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-contact-persons-grid',
  templateUrl: './contact-persons-grid.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPersonsGridComponent implements OnInit, OnDestroy {
  @Input() personId: number;

  private selectedContact$ = new BehaviorSubject<IContactPerson>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      action: () => {
        const { contactId } = this.selectedContact$.value;
        this.onEdit(contactId);
      },
      enabled: combineLatest(
        this.canEdit$,
        this.selectedContact$
      ).map(([canEdit, selectedContact]) => !!canEdit && !!selectedContact)
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      action: () => this.setDialog('removeContact'),
      enabled: combineLatest(
        this.canDelete$,
        this.selectedContact$
      ).map(([canDelete, selectedContact]) => !!canDelete && !!selectedContact),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      action: () => this.fetch(),
      enabled: this.canView$
    },
  ];

  columns: Array<ISimpleGridColumn<IContactPerson>> = [
    { prop: 'fullName' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { prop: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER },
    { prop: 'comment' },
    { prop: 'linkTypeCode', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ].map(addGridLabel('widgets.contact.grid'));

  contacts: Array<IContactPerson> = [];

  private dialog: string;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactPersonsService: ContactPersonsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) { }

  ngOnInit(): void {
    this.fetch();

    this.busSubscription = this.contactPersonsService
      .getAction(ContactPersonsService.MESSAGE_CONTACT_PERSON_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedContact$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  get selectedContact(): IContactPerson {
    return this.selectedContact$.value;
  }

  onDoubleClick(contact: IContactPerson): void {
    this.onEdit(contact.contactId);
  }

  onSelect(contacts: IContactPerson[]): void {
    this.selectedContact$.next(Array.isArray(contacts) ? contacts[0] : null);
  }

  onRemove(): void {
    const { contactId: contactId } = this.selectedContact$.value;
    this.contactPersonsService.delete(this.personId, contactId)
      .subscribe(() => {
        this.setDialog(null);
        this.fetch();
      });
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string): void {
    this.dialog = dialog;
  }

  onCancel(): void {
    this.setDialog(null);
  }

  private onAdd(): void {
    this.routingService.navigate([ 'contact/create' ], this.route);
  }

  /**
   * @param contactId       Linked person ID
   */
  private onEdit(contactId: number): void {
    this.routingService.navigate([ `contact/${contactId}` ], this.route);
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTACT_PERSON_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTACT_PERSON_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTACT_PERSON_EDIT').distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTACT_PERSON_DELETE').distinctUntilChanged();
  }

  private fetch(): void {
    this.contactPersonsService.fetchAll(this.personId)
      .subscribe(contacts => {
        this.contacts = [].concat(contacts);
        this.selectedContact$.next(null);
        this.cdRef.markForCheck();
      });
  }
}

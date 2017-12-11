import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IContact } from '../contact.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContactService } from '../contact.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-contact-grid',
  templateUrl: './contact-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactGridComponent implements OnInit, OnDestroy {

  private selectedContact$ = new BehaviorSubject<IContact>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedContact$.value.id),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.selectedContact$
      ).map(([canEdit, selectedContact]) => !!canEdit && !!selectedContact)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeContact'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.selectedContact$
      ).map(([canDelete, selectedContact]) => !!canDelete && !!selectedContact),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canView$
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'fullName' },
    { prop: 'birthDate', maxWidth: 110, renderer: 'dateRenderer' },
    { prop: 'birthPlace' },
    { prop: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER },
    { prop: 'familyStatusCode', dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS },
    { prop: 'educationCode', dictCode: UserDictionariesService.DICTIONARY_EDUCATION },
    { prop: 'linkTypeCode', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
    { prop: 'comment' },
  ];

  contacts: Array<IContact> = [];

  private dialog: string;
  private personId = (this.route.params as any).value.personId || null;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactService: ContactService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .map(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      })
      .pipe(first())
      .subscribe();

    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.contact.gen.plural').dispatch();
          this.clear();
        }
      });

    this.busSubscription = this.messageBusService
      .select(ContactService.MESSAGE_CONTACT_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedContact$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  get selectedContact(): IContact {
    return this.selectedContact$.value;
  }

  onDoubleClick(contact: IContact): void {
    this.onEdit(contact.id);
  }

  onSelect(contact: IContact): void {
    this.selectedContact$.next(contact);
  }

  onRemove(): void {
    const { id: contactId } = this.selectedContact$.value;
    this.contactService.delete(this.personId, contactId)
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
    this.router.navigate([ `${this.router.url}/contact/create` ]);
  }

  private onEdit(contactId: number): void {
    this.router.navigate([ `${this.router.url}/contact/${contactId}` ]);
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
    this.contactService.fetchAll(this.personId)
      .subscribe(contacts => {
        this.contacts = [].concat(contacts);
        this.selectedContact$.next(null);
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.contacts = [];
    this.selectedContact$.next(null);
    this.cdRef.markForCheck();
  }
}

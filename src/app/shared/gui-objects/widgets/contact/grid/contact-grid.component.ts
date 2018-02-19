import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IContact } from '@app/shared/gui-objects/widgets/contact/contact.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ContactService } from '@app/shared/gui-objects/widgets/contact/contact.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-contact-grid',
  templateUrl: './contact-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactGridComponent implements OnInit, OnDestroy {
  @Input() personId: number;

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
      enabled: combineLatest(
        this.canEdit$,
        this.selectedContact$
      ).map(([canEdit, selectedContact]) => !!canEdit && !!selectedContact)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeContact'),
      enabled: combineLatest(
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
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { prop: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER },
    { prop: 'comment' },
    { prop: 'linkTypeCode', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ];

  contacts: Array<IContact> = [];

  private dialog: string;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactService: ContactService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
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
          this.notificationsService.permissionError().entity('entities.contact.gen.plural').dispatch();
          this.clear();
        }
      });

    this.busSubscription = this.contactService
      .getAction(ContactService.MESSAGE_CONTACT_SAVED)
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
    this.routingService.navigate([ 'contact/create' ], this.route);
  }

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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IGridColumn } from '../../../../components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';
import { IIdentityDoc } from '../identity.interface';

import { GridService } from '../../../../components/grid/grid.service';
import { IdentityService } from '../identity.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { GridComponent } from '../../../../components/grid/grid.component';
import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-identity-grid',
  templateUrl: './identity-grid.component.html',
})
export class IdentityGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  private routeParams = (<any>this.route.params).value;
  private personId = this.routeParams.id || null;
  private contactId = this.routeParams.contactId || null;

  private selectedRows$ = new BehaviorSubject<IIdentityDoc[]>([]);

  dialog: string;
  gridStyles = this.contactId ? { height: '230px' } : { height: '200px' };
  toolbarClass = this.contactId ? 'bh' : 'bordered';
  busSubscription: Subscription;
  canViewSubscription: Subscription;

  identityDoc: IIdentityDoc;
  rows: IIdentityDoc[] = [];

  columns: Array<IGridColumn> = [
    { prop: 'docTypeCode', minWidth: 70, type: 'number', dictCode: UserDictionariesService.DICTIONARY_IDENTITY_TYPE },
    { prop: 'docNumber', type: 'string', minWidth: 70 },
    { prop: 'issueDate', type: 'date', renderer: 'dateRenderer', width: 110 },
    { prop: 'issuePlace', type: 'string' },
    { prop: 'expiryDate', type: 'date', renderer: 'dateRenderer', width: 110 },
    { prop: 'citizenship', type: 'string' },
    { prop: 'isMain', width: 70 , renderer: 'checkboxRenderer' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedRows$)
        .map(([canEdit, selected]) => canEdit && !!selected.length),
      action: () => this.onEdit(this.identityDoc.id)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.combineLatest(this.canDelete$, this.selectedRows$)
        .map(([canDelete, selected]) => canDelete && !!selected.length),
      action: () => this.setDialog('removeIdentity')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private identityService: IdentityService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
    // NOTE: on deper routes we should take the contactId
    this.personId = this.contactId || this.personId;

    this.onSubmitSuccess = this.onSubmitSuccess.bind(this);

    this.gridService.setDictionaryRenderers(this.columns)
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
        this.cdRef.markForCheck();
      });

    this.busSubscription = this.messageBusService
      .select(IdentityService.MESSAGE_IDENTITY_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.identityDocs.gen.plural').dispatch();
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.selectedRows$.complete();
    this.canViewSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
  }

  fetch(): void {
    if (this.personId) {
      this.identityService
        .fetchAll(this.personId)
        .subscribe(identities => {
          this.rows = [...identities];
          this.selectedRows$.next([]);
          this.cdRef.markForCheck();
        });
    }
  }

  onRemove(): void {
    this.identityService.delete(this.personId, this.grid.selected[0].id)
      .subscribe(this.onSubmitSuccess);
  }

  onSelect(doc: IIdentityDoc): void {
    this.identityDoc = doc;
    this.selectedRows$.next(this.grid.selected);
  }

  onDoubleClick(doc: IIdentityDoc): void {
    this.onEdit(doc.id);
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_DELETE');
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/identity/create` ]);
  }

  private onEdit(identityId: number): void {
    this.router.navigate([ `${this.router.url}/identity/${identityId}` ]);
  }

  private clear(): void {
    this.rows = [];
    this.cdRef.markForCheck();
  }

  private onSubmitSuccess(result: boolean): void {
    if (result) {
      this.fetch();
      this.setDialog();
    }
  }

}

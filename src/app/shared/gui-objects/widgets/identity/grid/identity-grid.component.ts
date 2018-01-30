import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { IIdentityDoc } from '@app/shared/gui-objects/widgets/identity/identity.interface';

import { GridService } from '@app/shared/components/grid/grid.service';
import { IdentityService } from '@app/shared/gui-objects/widgets/identity/identity.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

import { combineLatestAnd } from '@app/core/utils/helpers';
import { DialogFunctions } from '@app/core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-identity-grid',
  templateUrl: './identity-grid.component.html',
})
export class IdentityGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  private routeParams = this.route.snapshot.paramMap;
  @Input() personId = +this.routeParams.get('contactId') || +this.routeParams.get('personId') || null;

  private selectedRows$ = new BehaviorSubject<IIdentityDoc[]>([]);

  dialog: string;
  gridStyles = this.routeParams.get('contactId') ? { height: '230px' } : { height: '500px' };
  toolbarClass = !this.routeParams.get('contactId') ? 'bh' : 'bordered';
  onSaveSubscription: Subscription;
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
      enabled: combineLatestAnd([this.canEdit$, this.selectedRows$.map(s => !!s.length)]),
      action: () => this.onEdit(this.identityDoc.id)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([this.canDelete$, this.selectedRows$.map(s => !!s.length)]),
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
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
    this.onSubmitSuccess = this.onSubmitSuccess.bind(this);
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.onSaveSubscription = this.identityService
      .getAction(IdentityService.DEBTOR_IDENTITY_SAVED)
      .subscribe(() => this.fetch());

    this.canViewSubscription = this.canView$
      .subscribe(canView => {
        if (canView) {
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
    this.onSaveSubscription.unsubscribe();
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
    this.routingService.navigate([ 'identity/create' ], this.route);
  }

  private onEdit(identityId: number): void {
    this.routingService.navigate([ `identity/${identityId}` ], this.route);
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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IGridColumn, IRenderer } from '../../../components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../components/toolbar-2/toolbar-2.interface';
import { IIdentityDoc } from './identity.interface';

// import { Dialog } from '../../../../core/decorators/dialog';
import { GridService } from '../../../components/grid/grid.service';
import { IdentityService } from './identity.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { GridComponent } from '../../../components/grid/grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-identity-grid',
  templateUrl: './identity.component.html',
})
export class IdentityGridComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  private parentId: number;
  private dialog: string;
  private selectedRows$ = new BehaviorSubject<IIdentityDoc[]>([]);

  gridSubscription: Subscription;
  canViewSubscription: Subscription;

  identityDoc: IIdentityDoc;
  rows: IIdentityDoc[] = [];

  columns: Array<IGridColumn> = [
    { prop: 'docTypeCode', minWidth: 70, type: 'number' },
    { prop: 'docNumber', type: 'string', maxWidth: 70 },
    { prop: 'issueDate', type: 'date' },
    { prop: 'issuePlace', type: 'string' },
    { prop: 'expiryDate', type: 'date' },
    { prop: 'citizenship', type: 'string' },
    { prop: 'isMain', localized: true, maxWidth: 70 },
  ];

  renderers: IRenderer = {
    expiryDate: 'dateTimeRenderer',
    issueDate: 'dateTimeRenderer',
    isMain: 'yesNoRenderer',
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.setDialog('addIdentity')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedRows$)
        .map(([canEdit, selected]) => canEdit && selected.length === 1),
      action: () => this.setDialog('editIdentity')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.combineLatest(this.canDelete$, this.selectedRows$)
        .map(([canDelete, selected]) => canDelete && selected.length === 1),
      action: () => this.setDialog('removeIdentity')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private identityService: IdentityService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {

    this.parentId = Number((this.route.params as any).value.id) || null;
    this.onSubmitSuccess = this.onSubmitSuccess.bind(this);

    this.gridSubscription = Observable.combineLatest(
      this.canView$,
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_IDENTITY_TYPE),
    )
    .subscribe(([ canView, identityOptions ]) => {
      console.log('identityOptions', identityOptions);
      this.renderers.docTypeCode = [].concat(identityOptions);
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.cdRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .filter(canView => canView !== undefined)
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
    this.gridSubscription.unsubscribe();
    this.selectedRows$.complete();
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string): void {
    this.dialog = dialog;
  }

  fetch(): void {
    if (this.parentId) {
      this.identityService
        .fetch(this.parentId)
        .subscribe(identities => {
          this.rows = identities;
          this.selectedRows$.next([]);
          this.cdRef.markForCheck();
        });
    }
  }

  onAddDocument(doc: IIdentityDoc): void {
    this.identityService.create(this.parentId, doc)
      .subscribe(this.onSubmitSuccess);
  }

  onEditDocument(doc: IIdentityDoc): void {
    this.identityService.update(this.parentId, this.grid.selected[0].id, doc)
      .subscribe(this.onSubmitSuccess);
}

  onCancel(): void {
    this.setDialog(null);
  }

  onRemove(): void {
    this.identityService.delete(this.parentId, this.grid.selected[0].id)
      .subscribe(this.onSubmitSuccess);
  }

  onSelect(doc: IIdentityDoc): void {
    this.identityDoc = doc;
    this.selectedRows$.next(this.grid.selected);
  }

  onDoubleClick(doc: IIdentityDoc): void {
    this.setDialog('editIdentity');
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_EDIT').distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_DELETE').distinctUntilChanged();
  }

  private clear(): void {
    this.rows = [];
    this.cdRef.markForCheck();
  }

  private onSubmitSuccess(result: boolean): void {
    if (result) {
      this.fetch();
      this.setDialog(null);
    }
  }

}

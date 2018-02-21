import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ViewChild, OnDestroy, OnInit, Input, Output, EventEmitter
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IIdentityDoc } from '@app/routes/workplaces/debtor-card/identity/identity.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { IdentityService } from '@app/routes/workplaces/debtor-card/identity/identity.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

import { combineLatestAnd } from '@app/core/utils/helpers';
import { DialogFunctions } from '@app/core/dialog';
import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-identity-grid',
  templateUrl: './identity-grid.component.html',
})
export class IdentityGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  private routeParams = this.route.snapshot.paramMap;

  @Input()
  set personId(personId: number) {
    this._personId$.next(personId);
    this.cdRef.markForCheck();
  }

  @Output() add = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<IIdentityDoc>();
  @Output() edit = new EventEmitter<IIdentityDoc>();

  private _personId$ = new BehaviorSubject<number>(null);

  private selectedRows$ = new BehaviorSubject<IIdentityDoc[]>([]);

  dialog: string;
  gridStyles = this.routeParams.get('contactId') ? { height: '230px' } : { height: '500px' };
  toolbarClass = !this.routeParams.get('contactId') ? 'bh' : 'bordered';
  onSaveSubscription: Subscription;
  canViewSubscription: Subscription;

  identityDoc: IIdentityDoc;
  rows: IIdentityDoc[] = [];

  columns: Array<ISimpleGridColumn<IIdentityDoc>> = [
    { prop: 'docTypeCode', minWidth: 70, type: 'number', dictCode: UserDictionariesService.DICTIONARY_IDENTITY_TYPE },
    { prop: 'docNumber', type: 'string', minWidth: 70 },
    { prop: 'issueDate', type: 'date', renderer: 'dateRenderer', width: 110 },
    { prop: 'issuePlace', type: 'string' },
    { prop: 'expiryDate', type: 'date', renderer: 'dateRenderer', width: 110 },
    { prop: 'citizenship', type: 'string' },
    { prop: 'isMain', width: 70 , renderer: 'checkboxRenderer' },
  ].map(addGridLabel('debtor.identityDocs.grid'));

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestAnd([this.canAdd$, this._personId$.map(Boolean)]),
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([this.canEdit$, this.selectedRows$.map(s => !!s.length)]),
      action: () => this.onEdit(this.identityDoc)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([this.canDelete$, this.selectedRows$.map(s => !!s.length)]),
      action: () => this.setDialog('removeIdentity')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: combineLatestAnd([this.canView$, this._personId$.map(Boolean)]),
      action: () => this.fetch()
    },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private identityService: IdentityService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
    this.onSubmitSuccess = this.onSubmitSuccess.bind(this);
  }

  ngOnInit(): void {

    this.onSaveSubscription = this.identityService
      .getAction(IdentityService.DEBTOR_IDENTITY_SAVED)
      .subscribe(() => this.fetch());

    this.canViewSubscription = combineLatest(
      this.canView$,
      this._personId$.filter(Boolean)
    )
    .subscribe(([ canView ]) => {
      if (canView) {
        this.fetch();
      } else {
          this.notificationsService.permissionError().entity('entities.identityDocs.gen.plural').dispatch();
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
    if (this._personId$.value) {
      this.identityService
        .fetchAll(this._personId$.value)
        .subscribe(identities => {
          this.rows = [...identities];
          this.selectedRows$.next([]);
          this.cdRef.markForCheck();
        });
    }
  }

  onRemove(): void {
    this.identityService.delete(this._personId$.value, this.grid.selected[0].id)
      .subscribe(this.onSubmitSuccess);
  }

  onSelect(docs: IIdentityDoc[]): void {
    this.identityDoc = Array.isArray(docs) ? docs[0] : null;
    this.selectedRows$.next(this.grid.selected);
  }

  onDoubleClick(doc: IIdentityDoc): void {
    this.dblClick.emit(doc);
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
    this.add.emit();
  }

  private onEdit(doc: IIdentityDoc): void {
    this.edit.emit(doc);
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

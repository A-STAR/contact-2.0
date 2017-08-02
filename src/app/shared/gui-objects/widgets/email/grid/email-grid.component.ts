import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

import { IEmail } from '../email.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { EmailService } from '../email.service';
import { GridService } from '../../../../components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-email-grid',
  templateUrl: './email-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailGridComponent implements OnInit, OnDestroy {
  private selectedEmailId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedEmail$)
        .map(([ canEdit, email ]) => canEdit && !!email),
      action: () => this.onEdit(this.selectedEmailId$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_BLOCK,
      enabled: Observable.combineLatest(this.canBlock$, this.selectedEmail$)
        .map(([ canBlock, email ]) => canBlock && !!email && !email.isBlocked),
      action: () => this.setDialog(1)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNBLOCK,
      enabled: Observable.combineLatest(this.canUnblock$, this.selectedEmail$)
        .map(([ canUnblock, email ]) => canUnblock && !!email && email.isBlocked),
      action: () => this.setDialog(2)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.combineLatest(this.canDelete$, this.selectedEmail$)
        .map(([ canDelete, email ]) => canDelete && !!email),
      action: () => this.setDialog(3)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [];

  private _emails: Array<any> = [];

  private gridSubscription: Subscription;

  private renderers: IRenderer = {
    typeCode: [],
    blockReasonCode: []
  };

  private _columns: Array<IGridColumn> = [
    { prop: 'typeCode' },
    { prop: 'email' },
    { prop: 'isBlocked' },
    { prop: 'blockReasonCode' },
    { prop: 'blockDateTime' },
  ];

  private _dialog = null;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;

  constructor(
    private emailService: EmailService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_EMAIL_TYPE),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_EMAIL_REASON_FOR_BLOCKING),
      this.canViewBlock$,
    )
    .subscribe(([ typeCodeOptions, blockReasonCodeOptions, canViewBlock ]) => {
      this.renderers.typeCode = [].concat(typeCodeOptions);
      this.renderers.blockReasonCode = [].concat(blockReasonCodeOptions);
      const columns = this._columns.filter(column => {
        return canViewBlock ? true : [ 'isBlocked', 'blockReasonCode', 'blockDateTime' ].includes(column.prop)
      });
      this.columns = this.gridService.setRenderers(columns, this.renderers);
    });

    this.userDictionariesService.preload([
      UserDictionariesService.DICTIONARY_EMAIL_TYPE,
      UserDictionariesService.DICTIONARY_EMAIL_REASON_FOR_BLOCKING,
    ]);
  }

  ngOnInit(): void {
    this.fetch();
  }

  ngOnDestroy(): void {
    this.gridSubscription.unsubscribe();
  }

  get blockDialogDictionaryId(): number {
    return UserDictionariesService.DICTIONARY_EMAIL_REASON_FOR_BLOCKING;
  }

  get emails(): Array<IEmail> {
    return this._emails;
  }

  get dialog(): number {
    return this._dialog;
  }

  onDoubleClick(email: IEmail): void {
    this.onEdit(email.id);
  }

  onSelect(email: IEmail): void {
    this.selectedEmailId$.next(email.id);
  }

  onBlockDialogSubmit(blockReasonCode: number): void {
    this.emailService.block(18, this.id, this.selectedEmailId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onUnblockDialogSubmit(blockReasonCode: number): void {
    this.emailService.unblock(18, this.id, this.selectedEmailId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onRemoveDialogSubmit(): void {
    this.emailService.delete(18, this.id, this.selectedEmailId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onDialogClose(): void {
    this.setDialog(null);
  }

  get selectedEmail$(): Observable<IEmail> {
    return this.selectedEmailId$.map(id => this._emails.find(email => email.id === id));
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_VIEW').distinctUntilChanged();
  }

  get canViewBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_BLOCK_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'EMAIL_EDIT', 'EMAIL_COMMENT_EDIT' ]).distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_DELETE').distinctUntilChanged();
  }

  get canBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_BLOCK').distinctUntilChanged();
  }

  get canUnblock$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_UNBLOCK').distinctUntilChanged();
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/email/create` ]);
  }

  private onEdit(emailId: number): void {
    this.router.navigate([ `${this.router.url}/email/${emailId}` ]);
  }

  private fetch(): void {
    // TODO(d.maltsev): persist selection
    // TODO(d.maltsev): pass entity type
    this.emailService.fetchAll(18, this.id)
      .subscribe(emails => {
        this._emails = emails;
        this.cdRef.markForCheck();
      });
  }

  private setDialog(dialog: number): void {
    this._dialog = dialog;
    this.cdRef.markForCheck();
  }
}

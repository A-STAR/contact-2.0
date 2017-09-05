import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { IDocument } from '../document.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DocumentService } from '../document.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DownloaderComponent } from '../../../../components/downloader/downloader.component';

import { combineLatestAnd, combineLatestOr } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-document-grid',
  templateUrl: './document-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentGridComponent implements OnInit, OnDestroy {
  @ViewChild('downloader') downloader: DownloaderComponent;

  private selectedDocumentId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestOr([ this.canAddToDebt$, this.canAddToDebtor$ ]),
      children: [
        {
          label: 'Добавить к долгу',
          enabled: this.canAddToDebt$,
          action: () => this.onAdd()
        },
        {
          label: 'Добавить к должнику',
          enabled: this.canAddToDebtor$,
          action: () => this.onAdd()
        },
      ]
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([ this.canEdit$, this.selectedDocument$.map(Boolean) ]),
      action: () => this.onEdit(this.selectedDocumentId$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DOWNLOAD,
      enabled: this.selectedDocument$.map(Boolean),
      action: () => this.onDownload()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([ this.canDelete$, this.selectedDocument$.map(Boolean) ]),
      action: () => this.setDialog(3)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'docName' },
    { prop: 'fileName' },
    { prop: 'docTypeCode' },
    { prop: 'docNumber' },
    { prop: 'operatorName' },
    { prop: 'comment' }
  ];

  documents: Array<IDocument> = [];

  // TODO(d.maltsev): get name from server
  // See: https://stackoverflow.com/questions/33046930/how-to-get-the-name-of-a-file-downloaded-with-angular-http
  name$ = new BehaviorSubject<string>('foo');
  url$ = new BehaviorSubject<string>(null);

  private gridSubscription: Subscription;
  private canViewSubscription: Subscription;

  private renderers: IRenderer = {
    docTypeCode: [],
  };

  private _dialog = null;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;

  constructor(
    private documentService: DocumentService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridSubscription = this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_DOCUMENT_TYPE,
      ])
    .subscribe(options => {
      this.renderers = {
        ...this.renderers,
        docTypeCode: [ ...options[UserDictionariesService.DICTIONARY_DOCUMENT_TYPE] ],
      }
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
          this.notificationsService.error('errors.default.read.403').entity('entities.documents.gen.plural').dispatch();
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.gridSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  get canDisplayGrid(): boolean {
    return this.columns.length > 0;
  }

  get dialog(): number {
    return this._dialog;
  }

  onDoubleClick(document: IDocument): void {
    this.onEdit(document.id);
  }

  onSelect(document: IDocument): void {
    this.selectedDocumentId$.next(document.id);
    this.url$.next(`/api/fileattachments/${document.id}`);
  }

  onDownload(): void {
    this.downloader.download();
  }

  onRemoveDialogSubmit(): void {
    this.documentService.delete(18, this.id, this.selectedDocumentId$.value).subscribe(() => this.onSubmitSuccess());
  }

  onDialogClose(): void {
    this.setDialog(null);
  }

  get selectedDocument$(): Observable<IDocument> {
    return this.selectedDocumentId$.map(id => this.documents.find(document => document.id === id));
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_VIEW').distinctUntilChanged();
  }

  get canAddToDebt$(): Observable<boolean> {
    return this.userPermissionsService.bag().map(bag => bag.contains('FILE_ATTACHMENT_ADD_LIST', 19));
  }

  get canAddToDebtor$(): Observable<boolean> {
    return this.userPermissionsService.bag().map(bag => bag.contains('FILE_ATTACHMENT_ADD_LIST', 18));
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'ADDRESS_EDIT', 'ADDRESS_COMMENT_EDIT' ]).distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_DELETE').distinctUntilChanged();
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/document/create` ]);
  }

  private onEdit(documentId: number): void {
    this.router.navigate([ `${this.router.url}/document/${documentId}` ]);
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    // TODO(d.maltsev): persist selection
    // TODO(d.maltsev): pass entity type
    this.documentService.fetchAll(18, this.id)
      .subscribe(documents => {
        this.documents = documents;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.documents = [];
    this.cdRef.markForCheck();
  }

  private setDialog(dialog: number): void {
    this._dialog = dialog;
    this.cdRef.markForCheck();
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IDocument } from '../document.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { DocumentService } from '../document.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';

import { combineLatestOr, combineLatestAnd, addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-document-grid',
  templateUrl: './document-grid.component.html',
})
export class DocumentGridComponent implements OnInit, OnDestroy {
  @Input() action: 'edit' | 'download' = 'edit';
  @Input() callCenter = false;
  @Input() entityType: number;
  @Input() hideToolbar = false;
  @Input() entityId: number;

  @ViewChild('downloader') downloader: DownloaderComponent;

  private selectedDocumentId$ = new BehaviorSubject<number>(null);

  documents: Array<IDocument> = [];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestOr([ this.canAddToDebt$, this.canAddToDebtor$ ]),
      children: [
        {
          label: 'Добавить к долгу',
          enabled: this.canAddToDebt$,
          action: () => this.onAdd(19)
        },
        {
          label: 'Добавить к должнику',
          enabled: this.canAddToDebtor$,
          action: () => this.onAdd(18)
        },
      ]
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd(
        [ this.canEditOrDelete$(this.selectedDocumentEntityTypeCode), this.selectedDocument$.map(Boolean) ]
      ),
      action: () => this.onEdit(this.selectedDocumentId$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DOWNLOAD,
      enabled: this.selectedDocument$.map(Boolean),
      action: () => this.onDownload()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd(
        [ this.canEditOrDelete$(this.selectedDocumentEntityTypeCode), this.selectedDocument$.map(Boolean) ]
      ),
      action: () => this.setDialog('delete')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch()
    },
  ];

  columns: ISimpleGridColumn<IDocument>[] = [
    { prop: 'docName' },
    { prop: 'fileName' },
    { prop: 'docTypeCode', dictCode: UserDictionariesService.DICTIONARY_DOCUMENT_TYPE },
    { prop: 'docNumber' },
    { prop: 'fullName' },
    { prop: 'comment' }
  ].map(addGridLabel('widgets.document.grid'));

  private busSubscription: Subscription;

  private _dialog = null;

  constructor(
    private documentService: DocumentService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.busSubscription = this.documentService
      .getAction(DocumentService.MESSAGE_DOCUMENT_SAVED)
      .subscribe(() => this.fetch());

    this.fetch();
  }

  ngOnDestroy(): void {
    this.busSubscription.unsubscribe();
  }

  get dialog(): number {
    return this._dialog;
  }

  get selectedDocumentFileName$(): Observable<string> {
    return this.selectedDocument$.map(document => document && document.fileName);
  }

  get selectedDocumentURL$(): Observable<string> {
    return this.selectedDocumentId$.map(documentId => `/api/fileattachments/${documentId}`);
  }

  onDoubleClick(document: IDocument): void {
    this.selectedDocumentId$.next(document.id);
    switch (this.action) {
      case 'edit':
        this.onEdit(document.id);
        break;
      case 'download':
        this.cdRef.detectChanges();
        this.onDownload();
        break;
    }
  }

  onSelect(documents: IDocument[]): void {
    const id = isEmpty(documents)
      ? null
      : documents[0].id;
    this.selectedDocumentId$.next(id);
  }

  onDownload(): void {
    this.downloader.download();
  }

  onRemoveDialogSubmit(): void {
    this.selectedDocument$
      .pipe(first())
      .flatMap(document => {
        return this.documentService.delete(document.entityTypeCode, this.entityId, document.id, this.callCenter);
      })
      .subscribe(() => this.onSubmitSuccess());
  }

  onDialogClose(): void {
    this.setDialog(null);
  }

  isDialog(dialog: string): boolean {
    return this._dialog === dialog;
  }

  get selectedDocument$(): Observable<IDocument> {
    return this.selectedDocumentId$.map(id => this.documents.find(document => document.id === id));
  }

  canEditOrDelete$(entityTypeCode: number): Observable<boolean> {
    return this.userPermissionsService.bag().map(bag => bag.contains('FILE_ATTACHMENT_ADD_LIST', entityTypeCode));
  }

  get canAddToDebt$(): Observable<boolean> {
    return this.canEditOrDelete$(19);
  }

  get canAddToDebtor$(): Observable<boolean> {
    return this.canEditOrDelete$(18);
  }

  private get selectedDocumentEntityTypeCode(): number {
    const selectedDocument = this.documents.find(document => document.id === this.selectedDocumentId$.value);
    return selectedDocument ? selectedDocument.entityTypeCode : null;
  }

  private onAdd(entityType: number): void {
    this.router.navigate([ `${this.router.url}/document/create` ], {
      queryParams: { entityType },
    });
  }

  private onEdit(documentId: number): void {
    this.router.navigate([ `${this.router.url}/document/${documentId}` ]);
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    this.documentService.fetchAll(this.entityType, this.entityId, this.callCenter)
      .subscribe(documents => {
        this.documents = documents;
        this.selectedDocumentId$.next(null);
        this.cdRef.markForCheck();
      });
  }

  private setDialog(dialog: string): void {
    this._dialog = dialog;
    this.cdRef.markForCheck();
  }
}

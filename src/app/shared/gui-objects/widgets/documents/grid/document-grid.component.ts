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
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { IDocument } from '../document.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DocumentService } from '../document.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
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
  @Input() callCenter = false;
  @Input() personId: number;

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

  columns: Array<IGridColumn> = [
    { prop: 'docName' },
    { prop: 'fileName' },
    { prop: 'docTypeCode', dictCode: UserDictionariesService.DICTIONARY_DOCUMENT_TYPE },
    { prop: 'docNumber' },
    { prop: 'operatorName' },
    { prop: 'comment' }
  ];

  private gridSubscription: Subscription;
  private busSubscription: Subscription;

  private _dialog = null;

  constructor(
    private documentService: DocumentService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.gridSubscription = this.gridService.setDictionaryRenderers(this.columns)
      .subscribe(columns => this.columns = this.gridService.setRenderers(columns));

    this.busSubscription = this.messageBusService
      .select(DocumentService.MESSAGE_DOCUMENT_SAVED)
      .subscribe(() => this.fetch());

    this.fetch();
  }

  ngOnDestroy(): void {
    this.gridSubscription.unsubscribe();
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
    this.onEdit(document.id);
  }

  onSelect(document: IDocument): void {
    this.selectedDocumentId$.next(document.id);
  }

  onDownload(): void {
    this.downloader.download();
  }

  onRemoveDialogSubmit(): void {
    this.documentService.delete(18, this.personId, this.selectedDocumentId$.value, this.callCenter)
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
    const { callCenter } = this;
    this.router.navigate([ `${this.router.url}/document/create` ], { queryParams: { entityType, callCenter } });
  }

  private onEdit(documentId: number): void {
    const { callCenter } = this;
    this.router.navigate([ `${this.router.url}/document/${documentId}` ], { queryParams: { callCenter } });
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    this.documentService.fetchAll(18, this.personId, this.callCenter)
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

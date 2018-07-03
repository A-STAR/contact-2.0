import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { EntityType } from '@app/core/entity/entity.interface';
import { IDocument } from '@app/core/document/document.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { DocumentService } from '@app/core/document/document.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';

import { addGridLabel, combineLatestOr, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-document-grid',
  templateUrl: './document-grid.component.html',
})
export class DocumentGridComponent implements OnInit, OnDestroy {
  @Input() action: 'edit' | 'download' = 'download';
  @Input() addForEntity: EntityType[];
  @Input() callCenter = false;
  @Input() contractId: number;
  @Input() debtId: number;
  @Input() entityId: number;
  @Input() entityType: EntityType;
  @Input() hideToolbar = false;
  @Input() personId: number;

  @ViewChild('downloader') downloader: DownloaderComponent;

  private selectedDocumentId$ = new BehaviorSubject<number>(null);

  documents: Array<IDocument> = [];

  toolbarItems: IToolbarItem[];

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

    this.toolbarItems = this.buildToolbarItems();
    this.fetch();
  }

  ngOnDestroy(): void {
    this.busSubscription.unsubscribe();
  }

  get dialog(): number {
    return this._dialog;
  }

  readonly selectedDocumentFileName$ = this.selectedDocument$.map(document => document && document.fileName);

  readonly selectedDocumentMessageParams$ = this.selectedDocument$
    .map(document => ({ docName: document && document.docName || document.fileName }));

  readonly selectedDocumentURL$ = this.selectedDocumentId$.map(documentId => `/api/fileattachments/${documentId}`);

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
    const document = this.documents.find(d => d.id === documentId);
    if (document) {
      const { entityTypeCode, id } = document;
      this.router.navigate([ `${this.router.url}/document/${id}` ], { queryParams: { entityType: entityTypeCode } });
    }
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    this.getFetchSource().subscribe(documents => {
      this.documents = documents;
      this.selectedDocumentId$.next(null);
      this.cdRef.markForCheck();
    });
  }

  private setDialog(dialog: string): void {
    this._dialog = dialog;
    this.cdRef.markForCheck();
  }

  private buildToolbarItems(): IToolbarItem[] {
    return [
      this.buildToolbarAddButton(),
      {
        type: ToolbarItemTypeEnum.BUTTON_EDIT,
        enabled: combineLatestAnd([
          this.canEditOrDelete$(this.selectedDocumentEntityTypeCode),
          this.selectedDocument$.map(Boolean),
        ]),
        action: () => this.onEdit(this.selectedDocumentId$.value)
      },
      {
        type: ToolbarItemTypeEnum.BUTTON_DOWNLOAD,
        enabled: this.selectedDocument$.map(Boolean),
        action: () => this.onDownload(),
      },
      {
        type: ToolbarItemTypeEnum.BUTTON_DELETE,
        enabled: combineLatestAnd([
          this.canEditOrDelete$(this.selectedDocumentEntityTypeCode),
          this.selectedDocument$.map(Boolean),
        ]),
        action: () => this.setDialog('delete'),
      },
      {
        type: ToolbarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.fetch(),
      },
    ].filter(Boolean);
  }

  // See:
  // http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=109576221
  private buildToolbarAddButton(): IToolbarItem {
    switch (this.addForEntity.length) {
      case 0:
        return null;
      case 1:
        return {
          type: ToolbarItemTypeEnum.BUTTON_ADD,
          enabled: this.canEditOrDelete$(this.addForEntity[0]),
          action: () => this.onAdd(this.addForEntity[0]),
        };
      default:
        return {
          type: ToolbarItemTypeEnum.BUTTON_ADD,
          enabled: combineLatestOr(this.addForEntity.map(entity => this.canEditOrDelete$(entity))),
          children: this.addForEntity.map(entityType => ({
            label: `routes.workplaces.shared.documents.grid.toolbar.add.${entityType}`,
            enabled: this.canEditOrDelete$(entityType),
            action: () => this.onAdd(entityType)
          })),
        };
    }
  }

  private getFetchSource(): Observable<any> {
    switch (this.entityType) {
      case EntityType.DEBT:
        return this.documentService.fetchForDebt(this.debtId, this.callCenter);
      case EntityType.PLEDGOR:
        return this.documentService.fetchForPledgor(this.debtId, this.contractId, this.personId, this.callCenter);
      case EntityType.GUARANTOR:
        return this.documentService.fetchForGuarantor(this.debtId, this.contractId, this.personId, this.callCenter);
      default:
        return this.documentService.fetchForEntity(this.entityType, this.entityId, this.callCenter);
    }
  }
}

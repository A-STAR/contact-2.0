import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { AttachmentService } from './attachment.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../core/dialog';

@Component({
  selector: 'app-contact-registration-attachment',
  templateUrl: './attachment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentComponent extends DialogFunctions {
  @Input() debtId: number;

  private selectedDocumentGuid$ = new BehaviorSubject<string>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.setDialog('edit')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: this.selectedDocumentGuid$.map(Boolean),
      action: () => this.setDialog('delete')
    },
  ];

  columns: IGridColumn[] = [
    { prop: 'docName' },
    { prop: 'fileName' },
    { prop: 'docTypeCode', dictCode: UserDictionariesService.DICTIONARY_DOCUMENT_TYPE },
    { prop: 'docNumber' },
    { prop: 'comment' }
  ];

  documents: any[] = [];

  dialog: 'edit' | 'delete';

  constructor(
    private attachmentService: AttachmentService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private gridService: GridService,
  ) {
    super();
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => this.columns = this.gridService.setRenderers(columns));
  }

  get selectedDocument$(): Observable<any > {
    return this.selectedDocumentGuid$.map(guid => this.documents.find(document => document.guid === guid));
  }

  onSelect(document: any): void {
    this.selectedDocumentGuid$.next(document.guid);
  }

  onDoubleClick(document: any): void {
    this.selectedDocumentGuid$.next(document.guid);
    this.setDialog('edit');
  }

  onEditDialogSubmit(event: any): void {
    const { file, ...data } = event;
    const { guid } = this.contactRegistrationService;
    this.attachmentService.create(this.debtId, guid, data, file)
      .subscribe(fileGuid => {
        this.documents = [
          ...this.documents,
          {
            ...data,
            guid: fileGuid,
            fileName: file.name
          },
        ];
        this.setDialog();
        this.cdRef.markForCheck();
      });
  }

  onRemoveDialogSubmit(): void {
    const { guid } = this.contactRegistrationService;
    const fileGuid = this.selectedDocumentGuid$.value;
    this.attachmentService.delete(this.debtId, guid, fileGuid)
      .subscribe(() => {
        this.documents = this.documents.filter(document => document.guid !== fileGuid);
        this.setDialog();
        this.cdRef.markForCheck();
      });
  }
}

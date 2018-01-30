import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAttachment, IAttachmentFormData } from './attachment.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { AttachmentService } from './attachment.service';
import { ContactRegistrationService } from '../../contact-registration.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';

import { isEmpty } from '@app/core/utils';

@Component({
  selector: 'app-contact-registration-attachment',
  templateUrl: './attachment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRegistrationAttachmentsComponent extends DialogFunctions {
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

  documents: IAttachment[] = [];

  dialog: 'edit' | 'delete';

  constructor(
    private attachmentService: AttachmentService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private gridService: GridService,
  ) {
    super();
    this.gridService.setDictionaryRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [ ...columns ];
        this.cdRef.markForCheck();
      });
  }

  get selectedDocument$(): Observable<IAttachment > {
    return this.selectedDocumentGuid$.map(guid => this.documents.find(document => document.guid === guid));
  }

  get formDisabled$(): Observable<boolean> {
    return this.contactRegistrationService.outcome$
      .map(outcome => outcome.fileAttachMode === 3 && isEmpty(this.documents));
  }

  onSelect(document: IAttachment): void {
    this.selectedDocumentGuid$.next(document.guid);
  }

  onDoubleClick(document: IAttachment): void {
    this.selectedDocumentGuid$.next(document.guid);
    this.setDialog('edit');
  }

  onEditDialogSubmit(event: IAttachmentFormData): void {
    const { file, ...data } = event;
    const { debtId, guid } = this.contactRegistrationService;
    this.attachmentService.create(debtId, guid, data, file)
      .subscribe(fileGuid => {
        this.documents = [
          ...this.documents,
          {
            ...data,
            guid: fileGuid,
            fileName: file.name
          },
        ];
        this.onSuccess();
      });
  }

  onRemoveDialogSubmit(): void {
    const { debtId, guid } = this.contactRegistrationService;
    const fileGuid = this.selectedDocumentGuid$.value;
    this.attachmentService.delete(debtId, guid, fileGuid)
      .subscribe(() => {
        this.documents = this.documents.filter(document => document.guid !== fileGuid);
        this.onSuccess();
      });
  }

  onNextClick(): void {
    //
  }

  private onSuccess(): void {
    this.setDialog();
    this.cdRef.markForCheck();
  }
}

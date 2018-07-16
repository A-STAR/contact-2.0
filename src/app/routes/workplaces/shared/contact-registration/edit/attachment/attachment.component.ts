import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IAttachment, IAttachmentFormData } from './attachment.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { AttachmentService } from './attachment.service';
import { ContactRegistrationService } from '../../contact-registration.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';

import { isEmpty, addGridLabel } from '@app/core/utils';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-contact-registration-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRegistrationAttachmentsComponent extends DialogFunctions implements OnInit {
  private selectedDocumentGuid$ = new BehaviorSubject<string>(null);

  toolbar: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        action: () => this.setDialog('edit')
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        enabled: this.selectedDocumentGuid$.map(Boolean),
        action: () => this.setDialog('delete')
      },
    ]
  };

  columns: ISimpleGridColumn<IAttachment>[] = [
    { prop: 'docName' },
    { prop: 'fileName' },
    { prop: 'docTypeCode', dictCode: UserDictionariesService.DICTIONARY_DOCUMENT_TYPE },
    { prop: 'docNumber' },
    { prop: 'comment' }
  ].map(addGridLabel('routes.workplaces.shared.contactRegistration.edit.form.attachments.grid'));

  documents: IAttachment[] = [];

  dialog: 'edit' | 'delete';
  private _isRequired: boolean;

  constructor(
    private attachmentService: AttachmentService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isRequired$
      .pipe(first())
      .subscribe(isRequired => this._isRequired = isRequired);
  }

  readonly selectedDocument$ = this.selectedDocumentGuid$.map(guid => this.documents.find(document => document.guid === guid));

  readonly isRequired$ = this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.fileAttachMode === 3)
  );

  get isValid(): boolean {
    return this._isRequired ? !isEmpty(this.documents) : true;
  }


  onSelect(documents: IAttachment[]): void {
    const guid = isEmpty(documents)
      ? null
      : documents[0].guid;
    this.selectedDocumentGuid$.next(guid);
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

  private onSuccess(): void {
    this.setDialog();
    this.contactRegistrationService.onAttachmentChange();
    this.cdRef.markForCheck();
  }
}

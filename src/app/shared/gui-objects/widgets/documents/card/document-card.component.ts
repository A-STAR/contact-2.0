import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IDocument } from '../document.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DocumentService } from '../document.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { maxFileSize } from '../../../../../core/validators';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentCardComponent {
  @Input() callCenter = false;
  @Input() readOnly = false;

  @ViewChild('form') form: DynamicFormComponent;

  private id = (this.route.params as any).value.personId || null;
  private documentId = (this.route.params as any).value.documentId || null;
  private entityTypeCode = (this.route.queryParams as any).value.entityType || 18;

  controls: Array<IDynamicFormItem> = null;
  document: IDocument;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
  ) {
    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DOCUMENT_TYPE),
      this.userConstantsService.get('FileAttachment.MaxSize'),
      this.documentId
        ? this.documentService.fetch(this.entityTypeCode, this.id, this.documentId, this.callCenter)
        : of(null)
    )
    .pipe(first())
    .subscribe(([ options, maxSize, document ]) => {
      const fileSizeValidator = maxFileSize(1e3 * maxSize.valueN);
      this.controls = [
        { controlName: 'docTypeCode', type: 'select', options },
        { controlName: 'docName', type: 'text' },
        { controlName: 'docNumber', type: 'text' },
        { controlName: 'comment', type: 'textarea' },
        { controlName: 'file', type: 'file', fileName: document && document.fileName, validators: [ fileSizeValidator ] },
      ].map(control => ({
        ...control,
        label: `widgets.document.grid.${control.controlName}`,
        disabled: this.readOnly,
      } as IDynamicFormItem));
      this.document = document;
      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const { file, ...document } = this.form.serializedUpdates;
    const action = this.documentId
      ? this.documentService.update(this.entityTypeCode, this.id, this.documentId, document, file, this.callCenter)
      : this.documentService.create(this.entityTypeCode, this.id, document, file, this.callCenter);

    action.subscribe(() => {
      this.documentService.dispatchAction(DocumentService.MESSAGE_DOCUMENT_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.contentTabService.back();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

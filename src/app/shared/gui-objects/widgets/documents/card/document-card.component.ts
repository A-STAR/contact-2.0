import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDocument } from '../document.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DocumentService } from '../document.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html'
})
export class DocumentCardComponent {
  @ViewChild('file') file: ElementRef;
  @ViewChild('form') form: DynamicFormComponent;

  private id = (this.route.params as any).value.id || null;
  private documentId = (this.route.params as any).value.documentId || null;

  controls: Array<IDynamicFormItem> = null;
  document: IDocument;

  constructor(
    private contentTabService: ContentTabService,
    private documentService: DocumentService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DOCUMENT_TYPE),
      this.documentId ? this.documentService.fetch(18, this.id, this.documentId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ options, document ]) => {
      this.controls = [
        { label: 'widgets.document.grid.docTypeCode', controlName: 'docTypeCode', type: 'select', options },
        { label: 'widgets.document.grid.docName', controlName: 'docName', type: 'text' },
        { label: 'widgets.document.grid.docNumber', controlName: 'docNumber', type: 'text' },
        { label: 'widgets.document.grid.comment', controlName: 'comment', type: 'textarea' },
        { label: 'file', controlName: 'file', type: 'file' },
      ];
      this.document = document;
    });
  }

  public onSubmit(): void {
    const file = this.files[0];
    const action = this.documentId
      ? this.documentService.update(18, this.id, this.documentId, this.form.requestValue, file)
      : this.documentService.create(18, this.id, this.form.requestValue, file);

    action.subscribe(() => {
      this.messageBusService.dispatch(DocumentService.MESSAGE_DOCUMENT_SAVED);
      this.onBack();
    });
  }

  public onBack(): void {
    this.contentTabService.back();
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit && this.files.length > 0;
  }

  get files(): ArrayLike<File> {
    return this.file.nativeElement.files;
  }
}

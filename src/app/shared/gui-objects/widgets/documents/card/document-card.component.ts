import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, ViewChild } from '@angular/core';
import { RoutingService } from '@app/core/routing/routing.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IDocument } from '../document.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';

import { DebtorCardService } from '../../../../../core/app-modules/debtor-card/debtor-card.service';
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
export class DocumentCardComponent implements OnInit {
  @Input() callCenter = false;
  @Input() readOnly = false;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private documentId = Number(this.route.snapshot.paramMap.get('documentId'));
  private entityTypeCode = Number(this.route.snapshot.queryParamMap.get('entityType')) || 18;

  controls: Array<IDynamicFormItem> = null;
  document: IDocument;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private documentService: DocumentService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService
  ) {}

  ngOnInit(): void {
    const document$ = this.documentId
      ? this.debtorCardService.personId$
          .switchMap(personId => this.documentService.fetch(this.entityTypeCode, personId, this.documentId, this.callCenter))
      : of(null);

    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DOCUMENT_TYPE),
      this.userConstantsService.get('FileAttachment.MaxSize'),
      document$,
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
    const action$ = this.documentId
    ? this.debtorCardService.personId$
        .switchMap(personId =>
          this.documentService.update(this.entityTypeCode, personId, this.documentId, document, file, this.callCenter)
        )
    : this.debtorCardService.personId$
        .switchMap(personId =>
          this.documentService.create(this.entityTypeCode, personId, document, file, this.callCenter)
        );

    action$.pipe(first()).subscribe(() => {
      this.documentService.dispatchAction(DocumentService.MESSAGE_DOCUMENT_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ `/workplaces/debtor-card/${this.route.snapshot.paramMap.get('debtId')}` ], this.route);
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

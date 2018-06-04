import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IDocument } from '@app/routes/workplaces/core/document/document.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { DocumentService } from '@app/routes/workplaces/core/document/document.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { maxFileSize } from '@app/core/validators';
import { EntityType } from '@app/core/entity/entity.interface';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private routeParamMap = this.route.snapshot.paramMap;
  private queryParamMap = this.route.snapshot.queryParamMap;
  private routeData = this.route.snapshot.data;

  private callCenter = this.routeData.callCenter;
  private entityKey = this.routeData.entityKey;
  private readOnly = this.routeData.readOnly;
  private parentUrl = this.routeData.parentUrl;

  private documentId = Number(this.routeParamMap.get('documentId'));
  private entityTypeCode = Number(this.queryParamMap.get('entityType')) || EntityType.PERSON;

  controls: Array<IDynamicFormItem> = null;
  document: IDocument;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService
  ) {}

  ngOnInit(): void {
    const document$ = this.documentId
      ? this.debtorService.debtorId$
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
        { controlName: 'file',
          type: 'file',
          required: true,
          fileName: document && document.fileName,
          validators: [ fileSizeValidator ]
        },
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
    const entityId = Number(this.routeParamMap.get(this.entityIdKey));
    const action$ = this.documentId
      ? this.documentService.update(this.entityTypeCode, entityId, this.documentId, document, file, this.callCenter)
      : this.documentService.create(this.entityTypeCode, entityId, document, file, this.callCenter);

    action$.pipe(first()).subscribe(() => {
      this.documentService.dispatchAction(DocumentService.MESSAGE_DOCUMENT_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    if (this.parentUrl) {
      this.routingService.navigateToUrl(this.parentUrl);
    } else {
      this.routingService.navigateToParent(this.route);
    }
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  /**
   * OK, this is a bit hairy but this is how it works:
   *
   * When we navigate to this component, we have `entityTypeCode` query param.
   *
   * If it's not a person, we can straight up get it from corresponding route param.
   *
   * If it's a person, it can be contact person, guarantor or pledgor.
   * This is sorted using `entityKey` param in route data.
   */
  private get entityIdKey(): string {
    switch (this.entityTypeCode) {
      case EntityType.CONTRACTOR:
        return 'contractorId';
      case EntityType.DEBT:
        return 'debtId';
      case EntityType.GUARANTEE_CONTRACT:
      case EntityType.PLEDGE_CONTRACT:
        return 'contractId';
      case EntityType.PERSON:
        return this.entityKey;
      case EntityType.PORTFOLIO:
        return 'portfolioId';
      default:
        return 'personId';
    }
  }
}

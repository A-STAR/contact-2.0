import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { ILetterTemplate } from '@app/routes/utilities/letters/letters.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';

import { RoutingService } from '@app/core/routing/routing.service';
import { LettersService } from '@app/routes/utilities/letters/letters.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { maxFileSize } from '@app/core/validators';

@Component({
  selector: 'app-letter-template-card',
  templateUrl: './letter-template-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterTemplateCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'routes.utilities.letters.card',
  };
  template: Partial<ILetterTemplate>;
  templateId = Number(this.route.snapshot.paramMap.get('templateId'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private lettersService: LettersService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userConstantsService: UserConstantsService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.templateId ? this.lettersService.canEdit$ : this.lettersService.canAdd$,
      this.templateId ? this.lettersService.fetch(this.templateId) : of(this.getFormData()),
      this.userConstantsService.get('FileAttachment.MaxSize'),
    )
    .pipe(first())
    .subscribe(([ canEdit, template, maxSize ]) => {
      this.template = template;
      this.controls = this.initControls(canEdit, maxSize);
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const { file, ...template } = this.form.serializedUpdates;
    const action = this.templateId
      ? this.lettersService.update(this.templateId, template, file)
      : this.lettersService.create(template, file);

    action.subscribe(() => {
      this.lettersService.dispatchAction(LettersService.MESSAGE_LETTER_TEMPLATE_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ '/app/utilities/letters' ]);
  }

  private initControls(canEdit: boolean, maxSize: IUserConstant): IDynamicFormItem[] {
    return [
      { controlName: 'name', type: 'text', disabled: !canEdit, required: true },
      {
        controlName: 'recipientTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_MESSAGE_RECIPIENT_TYPE,
        disabled: !canEdit,
        required: true,
        markAsDirty: !this.templateId
      },
      {
        controlName: 'serviceTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_PRINT_SYSTEM_TYPE,
        disabled: !canEdit,
        required: true,
        markAsDirty: !this.templateId
      },
      {
        controlName: 'letterTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_LETTER_TEMPLATE_TYPE,
        disabled: !canEdit,
        required: true,
        markAsDirty: !this.templateId
      },
      { controlName: 'comment', type: 'textarea', disabled: !canEdit },
      {
        controlName: 'file',
        type: 'file',
        fileName: this.template && this.template.fileName,
        validators: [ maxFileSize(1e3 * maxSize.valueN) ],
        required: !this.templateId
      }
    ] as IDynamicFormItem[];
  }

  private getFormData(): Partial<ILetterTemplate> {
    return {
      recipientTypeCode: 0,
      serviceTypeCode: 1
    };
  }
}

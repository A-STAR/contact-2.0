import {
  ChangeDetectionStrategy, Component, EventEmitter, Output,
  ViewChild, OnInit, Input, ChangeDetectorRef
} from '@angular/core';
import { first } from 'rxjs/operators';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { IUserLetterTemplate } from '@app/core/user/templates/user-templates.interface';

import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-letter-generation-dialog',
  templateUrl: './letter-generation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterGenerationDialogComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;

  @Input() addressId: number;
  @Input() debtId: number;
  @Input() personId: number;
  @Input() personRole: number;

  @Output() cancel = new EventEmitter<void>();

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'routes.workplaces.shared.address.letterGeneration',
  };

  private formats: IOption[];
  private templates: IUserLetterTemplate[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userTemplatesService: UserTemplatesService,
    private valueConverterService: ValueConverterService,
    private userDictionariesService: UserDictionariesService
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.userTemplatesService.getLetterTemplatesForDebt(this.personRole, this.debtId),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PRINT_FILE_FORMAT_CODE)
    )
    .pipe(first())
    .subscribe(([ templates, formats ]) => {
      this.formats = formats;
      this.templates = templates;
      this.controls = [
        {
          controlName: 'templateId',
          type: 'select',
          options: templates.map(t => ({ label: t.name, value: t.id })),
          required: true,
          markAsDirty: true
        },
        {
          controlName: 'formatCode',
          type: 'select',
          options: formats,
          required: true
        },
        { controlName: 'regLetter', type: 'checkbox' }
      ];
      this.cdRef.markForCheck();
    });
  }

  get canGenerate(): boolean {
    return this.form && this.form.canSubmit;
  }

  get exportUrl(): string {
    return `/letters/${this.form.serializedValue.templateId}/form`;
  }

  get templateName(): string {
    const { formatCode, templateId } = this.form.serializedValue;
    const format = this.formats.find(f => f.value === formatCode);
    const template = this.templates.find(t => t.id === templateId);
    if (template && format) {
      return `${template.name}.${format.label.toLocaleLowerCase()}_${this.valueConverterService.toLocalDateTime(new Date())}`;
    }
  }

  onGenerate(): void {
    const { formatCode, regLetter } = this.form.serializedValue;
    this.downloader.download({
      debtId: this.debtId,
      personId: this.personId,
      personRole: this.personRole,
      addressId: this.addressId,
      formatCode,
      regLetter
    });
    this.cancel.emit();
  }

  onClose(): void {
    this.cancel.emit();
  }
}

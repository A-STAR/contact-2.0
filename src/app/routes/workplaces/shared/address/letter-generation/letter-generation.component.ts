import {
  ChangeDetectionStrategy, Component, EventEmitter, Output,
  ViewChild, OnInit, Input, ChangeDetectorRef
} from '@angular/core';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { LetterGenerationService } from '@app/routes/workplaces/shared/address/letter-generation/letter-generation.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-letter-generation-dialog',
  templateUrl: './letter-generation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterGenerationDialogComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() addressId: number;
  @Input() debtId: number;
  @Input() personId: number;
  @Input() personRole: number;

  @Output() cancel = new EventEmitter<void>();

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'routes.workplaces.shared.address.letterGeneration',
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private letterGenerationService: LetterGenerationService,
    private userTemplatesService: UserTemplatesService
  ) { }

  ngOnInit(): void {
    this.userTemplatesService.getLetterTemplatesForDebt(this.personRole, this.debtId)
      .subscribe(templates => {
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
            dictCode: UserDictionariesService.DICTIONARY_PRINT_FILE_FORMAT_CODE,
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

  onGenerate(): void {
    const { templateId, formatCode, regLetter } = this.form.serializedValue;
    this.letterGenerationService.generate(templateId, {
      debtId: this.debtId,
      personId: this.personId,
      personRole: this.personRole,
      addressId: this.addressId,
      formatCode,
      regLetter
    })
    .subscribe(() => this.cancel.emit());
  }

  onClose(): void {
    this.cancel.emit();
  }
}

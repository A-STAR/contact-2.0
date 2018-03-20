import {
  ChangeDetectionStrategy, Component, EventEmitter, Output,
  ViewChild, OnInit, Input, ChangeDetectorRef
} from '@angular/core';
import { of } from 'rxjs/observable/of';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
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
    private userTemplatesService: UserTemplatesService
  ) { }

  ngOnInit(): void {
    // this.userTemplatesService.getLetterTemplatesForDebt(this.personRole, this.debtId)
    of([
      { id: 1, name: '1' }
    ])
      .subscribe(templates => {
        this.controls = [
          {
            controlName: 'templateId',
            type: 'select',
            options: templates.map(t => ({ label: t.name, value: t.id })),
            required: true,
            markAsDirty: true
          },
          { controlName: 'formatCode', type: 'select', dictCode: UserDictionariesService.DICTIONARY_PRINT_FILE_FORMAT_CODE },
          { controlName: 'regLetter', type: 'checkbox' }
        ];
        this.cdRef.markForCheck();
      });
  }

  get canCalculate(): boolean {
    return this.form && this.form.canSubmit;
  }

  onCalculate(): void {
  }

  onClose(): void {
    this.cancel.emit();
  }
}

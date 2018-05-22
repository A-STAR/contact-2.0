import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { IDynamicLayoutConfig, DynamicLayoutItemType, DynamicLayoutControlType } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import { ICloseAction } from '@app/shared/mass-ops/mass-operation.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { ILetterGenerationParams } from './letter-generation.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { LetterGenerationService } from './letter-generation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-letter-generation',
  templateUrl: 'letter-generation.component.html'
})
export class LetterGenerationComponent {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  layoutConfig: IDynamicLayoutConfig = {
    key: 'letter-generation',
    items: [
      {
        label: 'widgets.mass.letter.form.templateId',
        name: 'templateId',
        type: DynamicLayoutItemType.CONTROL,
        controlType: DynamicLayoutControlType.SELECT,
        validators: {
          required: true
        }
      },
      {
        label: 'widgets.mass.letter.form.formatCode',
        name: 'formatCode',
        type: DynamicLayoutItemType.CONTROL,
        controlType: DynamicLayoutControlType.SELECT,
        dictCode: UserDictionariesService.DICTIONARY_PRINT_FILE_FORMAT_CODE,
        validators: {
          required: true
        }
      },
      {
        label: 'widgets.mass.letter.form.regLetter',
        name: 'regLetter',
        type: DynamicLayoutItemType.CONTROL,
        controlType: DynamicLayoutControlType.CHECKBOX
      },
      {
        label: 'widgets.mass.letter.form.addressTypes',
        name: 'addressTypes',
        type: DynamicLayoutItemType.CONTROL,
        controlType: DynamicLayoutControlType.MULTISELECT,
        dictCode: UserDictionariesService.DICTIONARY_ADDRESS_STATUS,
        validators: {
          required: true
        }
      },
      {
        label: 'widgets.mass.letter.form.avoidDuplication',
        name: 'avoidDuplication',
        type: DynamicLayoutItemType.CONTROL,
        controlType: DynamicLayoutControlType.CHECKBOX
      },
      {
        label: 'widgets.mass.letter.form.ignoreWrongAddress',
        name: 'ignoreWrongAddress',
        type: DynamicLayoutItemType.CONTROL,
        controlType: DynamicLayoutControlType.CHECKBOX
      },
      {
        label: 'widgets.mass.letter.form.sortRule',
        name: 'sortRule',
        type: DynamicLayoutItemType.CONTROL,
        dictCode: UserDictionariesService.DICTIONARY_REGION_SORT_TYPE,
        controlType: DynamicLayoutControlType.MULTISELECT,
      },
      {
        label: 'widgets.mass.letter.form.reportId',
        name: 'reportId',
        type: DynamicLayoutItemType.CONTROL,
        lookupKey: 'letterReport',
        controlType: DynamicLayoutControlType.SELECT,
      },
    ]
  };

  controls: IDynamicFormControl[];

  data: Partial<ILetterGenerationParams> = {
    regLetter: 1,
    avoidDuplication: 1,
    ignoreWrongAddress: 1
  };

  constructor(
    private letterGenerationService: LetterGenerationService
  ) { }

  get isDisabled(): boolean {
    return !this.layout || !this.layout.canSubmit;
  }

  onSubmit(): void {
    this.letterGenerationService
      .generate(this.actionData.payload, this.layout.getData())
      .subscribe(() => this.close.emit({ refresh: false }));
  }

  onClose(): void {
    this.close.emit({ refresh: false });
  }
}

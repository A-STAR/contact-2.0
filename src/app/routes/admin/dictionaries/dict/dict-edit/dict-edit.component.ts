import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { IDictionary, ITerm } from '../../dictionaries.interface';
import {
  IDynamicFormItem,
  IDynamicFormConfig
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { toLabeledValues } from '@app/core/utils';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  host: { class: 'full-size' },
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() canEdit: boolean;
  @Input() dictionaries: IDictionary[];
  @Input() dictionaryTermTypes: ITerm[];
  @Input() dictionary: IDictionary;
  @Input() title: string;
  @Input() isCreate = false;

  @Output() cancel = new EventEmitter<null>();
  @Output() submit = new EventEmitter<null>();

  config: IDynamicFormConfig = {
    labelKey: 'dictionaries.edit',
  };
  controls: IDynamicFormItem[];

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.controls = this.getControls();
    this.cdRef.markForCheck();
  }

  onSubmit(): any {
    this.submit.emit(this.form.serializedUpdates);
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onClose(): void {
    this.cancel.emit();
  }

  private getControls(): IDynamicFormItem[] {

    const disabled = !this.canEdit;
    return [
      {
        controlName: 'code',
        type: 'number',
        required: true,
        disabled,
      },
      {
        controlName: 'names',
        type: 'multilanguage',
        required: true,
        createMode: this.isCreate,
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_DICT_NAME,
          entityId: this.dictionary && this.dictionary.id
        },
        disabled,
      },
      {
        controlName: 'typeCode',
        type: 'select',
        required: true,
        dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE,
        disabled,
      },
      {
        controlName: 'parentCode',
        type: 'select',
        options: this.dictionaries.map(toLabeledValues),
        disabled,
      },
      {
        controlName: 'termTypeCode',
        type: 'select',
        required: true,
        options: this.dictionaryTermTypes.map(toLabeledValues),
        disabled,
      }
    ] as IDynamicFormItem[];
  }
}

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

import { EntityTranslationsConstants } from '../../../../../core/entity/translations/entity-translations.interface';
import { ITerm } from '../../dictionaries.interface';
import {
  IDynamicFormItem,
  IDynamicFormConfig
} from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select.interface';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { toLabeledValues } from '../../../../../core/utils';

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() canEdit = false;
  @Input() disableParentSelection = false;
  @Input() term: ITerm;
  @Input() terms: ITerm[];
  @Input() title: string;

  @Output() submit = new EventEmitter<ITerm>();
  @Output() cancel = new EventEmitter<null>();

  config: IDynamicFormConfig = {
    labelKey: 'terms.edit',
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
    return this.submit.emit(this.form.serializedUpdates);
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onClose(): void {
    this.cancel.emit();
  }

  private getControls(): IDynamicFormItem[] {

    const disabled = !this.canEdit;
    const controls: Partial<IDynamicFormItem>[] = [
      {
        controlName: 'code',
        type: 'number',
        required: true,
        disabled,
      },
      {
        controlName: 'name',
        type: this.term ? 'multilanguage' : 'text',
        required: true,
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_TERM_NAME,
          entityId: this.term && this.term.id
        },
        disabled,
      },
      {
        controlName: 'typeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE,
        required: true,
        disabled,
      },
      {
        controlName: 'parentCode',
        disabled: this.disableParentSelection || disabled,
        type: 'select',
        options: this.terms.map(toLabeledValues),
        optionsActions: [
          { text: 'terms.edit.select.title', type: SelectionActionTypeEnum.SORT }
        ],
      },
      {
        controlName: 'isClosed',
        type: 'checkbox',
        disabled,
      }
    ];

    return controls as IDynamicFormItem[];
  }
}

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

import { ITerm } from '../../dictionaries.interface';
import {
  IDynamicFormControl,
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
  controls: Array<IDynamicFormItem>;

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

  private getControls(): IDynamicFormControl[] {

    const disabled = !this.canEdit;
    const controls: Partial<IDynamicFormControl>[] = [
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
        langConfig: { entityAttributeId: 12, entityId: this.term.id },
        disabled,
      },
      {
        controlName: 'typeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE,
        required: true,
        label: 'terms.edit.typeCode',
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

    return controls as IDynamicFormControl[];
  }
}

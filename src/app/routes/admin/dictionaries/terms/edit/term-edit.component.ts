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

import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { ITerm } from '../../dictionaries.interface';
import {
  IDynamicFormConfig,
  IDynamicFormControl
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { toLabeledValues } from '@app/core/utils';

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
  @Input() isCreate = false;

  @Output() submit = new EventEmitter<ITerm>();
  @Output() cancel = new EventEmitter<null>();

  config: IDynamicFormConfig = {
    labelKey: 'terms.edit',
  };
  controls: IDynamicFormControl[];

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
    const controls = [
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
      },
      {
        controlName: 'isClosed',
        type: 'checkbox',
        disabled,
      }
    ] as IDynamicFormControl[];

    return controls;
  }
}

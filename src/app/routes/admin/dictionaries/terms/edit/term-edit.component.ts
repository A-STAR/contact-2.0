import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import { ITerm } from '../../../../../core/dictionaries/dictionaries.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';

import {
  EntityBaseComponent,
  TranslationFieldsExtension
} from '../../../../../shared/components/entity/edit/entity.base.component';

const NAME_TRANSLATIONS_CONTROL_NAME = 'nameTranslations';
const TRANSLATED_NAME_CONTROL_NAME = 'translatedName';
const NAME_CONTROL_NAME = 'name';

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermEditComponent extends EntityBaseComponent<ITerm> implements OnInit {

  @Input() languages: ILookupLanguage[];
  @Input() terms: ITerm[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.isEditMode()) {
      this.extensions.push(
        new TranslationFieldsExtension<ITerm>(this, TRANSLATED_NAME_CONTROL_NAME, NAME_TRANSLATIONS_CONTROL_NAME)
      );
    }
    super.ngOnInit();
  }

  protected getControls(): Array<IDynamicFormControl> {
    const filteredControls = [
      {
        label: 'terms.edit.code',
        controlName: 'code',
        type: 'number',
        required: true
      },
      {
        label: 'terms.edit.text',
        controlName: NAME_TRANSLATIONS_CONTROL_NAME,
        type: 'select',
        multiple: true,
        required: true,
        placeholder: 'dictionaries.placeholder.select.translation',
        options: this.languages.map(userLanguage =>
          ({ label: userLanguage.name, value: userLanguage.id, canRemove: !userLanguage.isMain })
        )
      },
      {
        label: 'terms.edit.text',
        controlName: NAME_CONTROL_NAME,
        type: 'text',
        required: true
      },
      {
        controlName: TRANSLATED_NAME_CONTROL_NAME,
        type: 'text',
        placeholder: 'dictionaries.placeholder.translatedName',
        required: true
      },
      {
        label: 'terms.edit.type',
        controlName: 'typeCode',
        type: 'select',
        required: true,
        // TODO Duplication
        options: [
          { label: 'dictionaries.types.system', value: 1 },
          { label: 'dictionaries.types.client', value: 2 },
        ]
      },
      {
        label: 'terms.edit.parent',
        controlName: 'parentCode',
        type: 'select',
        options: this.terms.map(term => ({ label: term.name, value: term.code })),
        optionsActions: [
          { text: 'terms.edit.select.title', type: SelectionActionTypeEnum.SORT }
        ]
      },
      {
        label: 'terms.edit.closed',
        controlName: 'isClosed',
        type: 'checkbox'
      }
    ].filter(
      (control) => {
        return this.isEditMode()
          ? ![NAME_CONTROL_NAME].includes(control.controlName)
          : ![NAME_TRANSLATIONS_CONTROL_NAME, TRANSLATED_NAME_CONTROL_NAME].includes(control.controlName);
      });

    return filteredControls as Array<IDynamicFormControl>;
  }
}

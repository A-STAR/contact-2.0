import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import { IDictionary, ITerm } from '../../../../../core/dictionaries/dictionaries.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';

import { EntityBaseComponent, TranslationFieldsExtension } from '../../../../../shared/components/entity/edit/entity.base.component';

const NAME_TRANSLATIONS_CONTROL_NAME = 'nameTranslations';
const TRANSLATED_NAME_CONTROL_NAME = 'translatedName';
const NAME_CONTROL_NAME = 'name';

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictEditComponent extends EntityBaseComponent<IDictionary> implements OnInit {

  @Input() languages: ILookupLanguage[];
  @Input() dictionaries: IDictionary[];
  @Input() dictionaryTermTypes: ITerm[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.isEditMode()) {
      this.extensions.push(
        new TranslationFieldsExtension<IDictionary>(this, TRANSLATED_NAME_CONTROL_NAME, NAME_TRANSLATIONS_CONTROL_NAME)
      );
    }
    super.ngOnInit();
  }

  toSubmittedValues(values: IDictionary): IDictionary {
    const { parentCode, termTypeCode, typeCode } = values;
    return {
      ...values,
      parentCode: Array.isArray(parentCode) ? parentCode[0].value : parentCode,
      termTypeCode: Array.isArray(termTypeCode) ? termTypeCode[0].value : termTypeCode,
      typeCode: Array.isArray(typeCode) ? typeCode[0].value : typeCode,
    }
  }

  protected getControls(): Array<IDynamicFormControl> {
    const filteredControls = [
      {
        label: 'dictionaries.edit.code',
        controlName: 'code',
        type: 'number',
        required: true
      },
      {
        label: 'dictionaries.edit.name',
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
        label: 'dictionaries.edit.name',
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
        label: 'dictionaries.edit.type',
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
        label: 'dictionaries.edit.parent',
        controlName: 'parentCode',
        type: 'select',
        options: this.dictionaries.map(dictionary => ({ label: dictionary.name, value: dictionary.code })),
        optionsActions: [
          { text: 'dictionaries.edit.select.title.dictList', type: SelectionActionTypeEnum.SORT }
        ]
      },
      {
        label: 'dictionaries.edit.termTypeCode',
        controlName: 'termTypeCode',
        type: 'select',
        required: true,
        options: this.dictionaryTermTypes.map(term => ({ label: term.name, value: term.code })),
        optionsActions: [
          { text: 'dictionaries.edit.select.title.termTypesList', type: SelectionActionTypeEnum.SORT }
        ]
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

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IDictionary, ITerm } from '../../../../../core/dictionaries/dictionaries.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select.interface';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';

import { toLabeledValues } from '../../../../../core/utils';

import { EntityTranslationComponent } from '../../../../../shared/components/entity/translation.component';

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictEditComponent extends EntityTranslationComponent<IDictionary> {

  @Input() languages: ILookupLanguage[];
  @Input() dictionaries: IDictionary[];
  @Input() dictionaryTermTypes: ITerm[];

  toSubmittedValues(values: IDictionary): any {
    return this.dynamicForm.requestValue;
  }

  protected getControls(): Array<IDynamicFormControl> {
    const controls: IDynamicFormControl[] = [
      {
        label: 'dictionaries.edit.code',
        controlName: 'code',
        type: 'number',
        required: true
      },
      {
        label: 'dictionaries.edit.name',
        controlName: this.translatedControlName,
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
        controlName: this.nameControlName,
        type: 'text',
        required: true
      },
      {
        label: null,
        controlName: this.displayControlName,
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
        options: this.dictionaries.map(toLabeledValues),
        optionsActions: [
          { text: 'dictionaries.edit.select.title.dictList', type: SelectionActionTypeEnum.SORT }
        ]
      },
      {
        label: 'dictionaries.edit.termTypeCode',
        controlName: 'termTypeCode',
        type: 'select',
        required: true,
        options: this.dictionaryTermTypes.map(toLabeledValues),
        optionsActions: [
          { text: 'dictionaries.edit.select.title.termTypesList', type: SelectionActionTypeEnum.SORT }
        ]
      }
    ];
    // .filter(
    //   (control) => {
    //     return this.isEditMode()
    //       ? this.nameControlName !== control.controlName
    //       : ![this.translatedControlName, this.displayControlName].includes(control.controlName);
    //   });

    return this.filterControls(controls);
  }
}

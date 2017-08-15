import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ITerm } from '../../../../../core/dictionaries/dictionaries.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';

import { toLabeledValues } from '../../../../../core/utils';

import { EntityTranslationComponent } from '../../../../../shared/components/entity/entity.translation.component';

const nameControlName = 'name';

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermEditComponent extends EntityTranslationComponent<ITerm> implements OnInit {

  @Input() languages: ILookupLanguage[];
  @Input() terms: ITerm[];

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
        label: 'terms.edit.text',
        controlName: nameControlName,
        type: 'text',
        required: true
      },
      {
        controlName: this.displayControlName,
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
        options: this.terms.map(toLabeledValues),
        optionsActions: [
          { text: 'terms.edit.select.title', type: SelectionActionTypeEnum.SORT }
        ]
      },
      {
        label: 'terms.edit.closed',
        controlName: 'isClosed',
        type: 'checkbox'
      }
    ]
    .filter(control => {
      return this.isEditMode()
        ? nameControlName !== control.controlName
        : ![this.translatedControlName, this.displayControlName].includes(control.controlName);
    });

    return filteredControls as Array<IDynamicFormControl>;
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ITerm } from '../../../../../core/dictionaries/dictionaries.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select.interface';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';

import { toLabeledValues } from '../../../../../core/utils';

import { EntityTranslationComponent } from '../../../../../shared/components/entity/translation.component';

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermEditComponent extends EntityTranslationComponent<ITerm> {

  @Input() languages: ILookupLanguage[];
  @Input() terms: ITerm[];

  toSubmittedValues(values: ITerm): any {
    return this.dynamicForm.requestValue;
  }

  protected getControls(): Array<IDynamicFormControl> {
    const controls: IDynamicFormControl[] = [
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
    ];
    // .filter(control => {
    //   return this.isEditMode()
    //     ? nameControlName !== control.controlName
    //     : ![this.translatedControlName, this.displayControlName].includes(control.controlName);
    // });

    return this.filterControls(controls);
  }
}

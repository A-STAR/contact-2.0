import { Component, OnInit } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IDict } from '../dict.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';

import { GridService } from '../../../../../shared/components/grid/grid.service';

import {
  EntityBaseComponent,
  TranslationFieldsExtension
} from '../../../../../shared/components/entity/edit/entity.base.component';

const NAME_TRANSLATIONS_CONTROL_NAME = 'nameTranslations';
const TRANSLATED_NAME_CONTROL_NAME = 'translatedName';
const NAME_CONTROL_NAME = 'name';

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html'
})
export class DictEditComponent extends EntityBaseComponent<IDict> implements OnInit {

  constructor(private gridService: GridService) {
    super();
  }

  ngOnInit(): void {
    if (this.isEditMode()) {
      this.extensions.push(
        new TranslationFieldsExtension<IDict>(this, TRANSLATED_NAME_CONTROL_NAME, NAME_TRANSLATIONS_CONTROL_NAME)
      );
    }
    super.ngOnInit();
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
        placeholder: 'dictionaries.placeholder.select.translation',
        loadLazyItemsOnInit: true,
        lazyOptions: this.gridService.read('/api/userlanguages')
          .map(data => data.languages.map(lang => ({label: lang.name, value: lang.id})))
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
        loadLazyItemsOnInit: true,
        lazyOptions: this.gridService.read('/api/dictionaries')
          .map(data => data.dictNames.map(dict => ({label: dict.name, value: dict.id}))),
        optionsActions: [
          { text: 'dictionaries.edit.select.title.dictList', type: SelectionActionTypeEnum.SORT }
        ]
      },
      {
        label: 'dictionaries.edit.termTypeCode',
        controlName: 'termTypeCode',
        type: 'select',
        required: true,
        loadLazyItemsOnInit: true,
        lazyOptions: this.gridService.read('/api/dictionaries')
          .map(data => data.dictNames.map(dict => ({label: dict.name, value: dict.code})))
          // TODO Dictionary service, code = 5 - term types code
          .map((data) => data.filter((v) => v.value === 5)),
        optionsActions: [
          { text: 'dictionaries.edit.select.title.termTypesList', type: SelectionActionTypeEnum.SORT }
        ]
      }
    ].filter(
      (control) => {
        return this.isEditMode()
          ? [NAME_CONTROL_NAME].indexOf(control.controlName) === -1
          : [NAME_TRANSLATIONS_CONTROL_NAME, TRANSLATED_NAME_CONTROL_NAME].indexOf(control.controlName) === -1;
      });

    return filteredControls as Array<IDynamicFormControl>;
  }
}

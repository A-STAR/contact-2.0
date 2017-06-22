import { Component, OnDestroy, OnInit } from '@angular/core';

import { IDictionary, ITerm } from '../../../../../core/dictionaries/dictionaries.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { ILabeledValue } from '../../../../../core/converter/value/value-converter.interface';
import { IUserLanguage } from '../../../../../core/user/languages/user-languages.interface';

import { UserLanguagesService } from '../../../../../core/user/languages/user-languages.service';
import { DictionariesService } from '../../../../../core/dictionaries/dictionaries.service';

import { EntityBaseComponent, TranslationFieldsExtension } from '../../../../../shared/components/entity/edit/entity.base.component';

const NAME_TRANSLATIONS_CONTROL_NAME = 'nameTranslations';
const TRANSLATED_NAME_CONTROL_NAME = 'translatedName';
const NAME_CONTROL_NAME = 'name';

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html'
})
export class DictEditComponent extends EntityBaseComponent<IDictionary> implements OnInit, OnDestroy {

  private languagesSubscription;
  private dictionariesSubscription;
  private languages: ILabeledValue[];
  private dictionaries: ILabeledValue[];
  private terms5Subscription;
  private terms5: ILabeledValue[];

  constructor(
    private userLanguagesService: UserLanguagesService,
    private dictionariesService: DictionariesService
  ) {
    super();

    this.languagesSubscription = userLanguagesService.userLanguages.subscribe((terms: IUserLanguage[]) => {
      this.languages = terms.map((userLanguage: IUserLanguage) =>
        ({ label: userLanguage.name, value: userLanguage.id, canRemove: !userLanguage.isMain })
      );
    });
    this.dictionariesSubscription = dictionariesService.dictionaries.subscribe((dictionaries: IDictionary[]) => {
      this.dictionaries = dictionaries.map((dictionary: IDictionary) =>
        ({ label: dictionary.name, value: dictionary.code }));
    });
    this.terms5Subscription = dictionariesService.terms5.subscribe((terms: ITerm[]) => {
      this.terms5 = terms.map((term: ITerm) =>
        ({ label: term.name, value: term.code }));
    });
  }

  ngOnInit(): void {
    if (this.isEditMode()) {
      this.extensions.push(
        new TranslationFieldsExtension<IDictionary>(this, TRANSLATED_NAME_CONTROL_NAME, NAME_TRANSLATIONS_CONTROL_NAME)
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
        options: this.languages
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
        options: this.dictionaries,
        optionsActions: [
          { text: 'dictionaries.edit.select.title.dictList', type: SelectionActionTypeEnum.SORT }
        ]
      },
      {
        label: 'dictionaries.edit.termTypeCode',
        controlName: 'termTypeCode',
        type: 'select',
        required: true,
        options: this.terms5,
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

  ngOnDestroy(): void {
    this.languagesSubscription.unsubscribe();
    this.dictionariesSubscription.unsubscribe();
    this.terms5Subscription.unsubscribe();
  }
}

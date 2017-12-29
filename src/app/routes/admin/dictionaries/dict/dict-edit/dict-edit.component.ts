import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { IDictionary, ITerm } from '../../dictionaries.interface';
import { IDynamicFormControl, IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select.interface';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { toLabeledValues } from '../../../../../core/utils';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('dictionaries.edit');

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() dictionaries: IDictionary[];
  @Input() dictionaryTermTypes: ITerm[];
  @Input() editedEntity: IDictionary;
  @Input() editMode: boolean;
  @Input() languages: ILookupLanguage[];

  controls: Array<IDynamicFormItem> = null;

  constructor(
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DICTIONARY_TYPE)
      .pipe(first())
      .subscribe(dictTypeOptions => {
        this.controls = this.getControls(dictTypeOptions);
      });
  }

  onSubmit(): any {
    return this.form.serializedUpdates;
  }

  /**
   * @override
   */
  // filterControls(controls: IDynamicFormControl[]): IDynamicFormControl[] {
  //   return controls.filter(control => {
  //       return this.isEditMode()
  //       ? this.nameControlName !== control.controlName
  //       : ![this.translatedControlName, this.displayControlName].includes(control.controlName);
  //   });
  // }

  /**
   * @override
   */
  protected isEditMode(): boolean {
    return !!this.editedEntity;
  }

  /**
   * @override
   */
  protected getControls(dictTypeOptions: IOption[]): Array<IDynamicFormControl> {
    // TODO(a.tymchuk): remove duplication across the codebase
    const canEdit = this.editMode;
    const controls: IDynamicFormControl[] = [
      {
        label: label('code'),
        controlName: 'code',
        type: 'number',
        required: true,
        disabled: canEdit,
      },
      {
        label: label('name'),
        controlName: 'name',
        type: 'multilanguage',
        required: true,
        options: this.languages.map(language =>
          ({ label: language.name, value: language.id, canRemove: !language.isMain })
        ),
        disabled: canEdit,
      },
      {
        label: label('type'),
        controlName: 'typeCode',
        type: 'select',
        required: true,
        options: dictTypeOptions,
        disabled: canEdit,
      },
      {
        label: label('parent'),
        controlName: 'parentCode',
        type: 'select',
        options: this.dictionaries.map(toLabeledValues),
        optionsActions: [
          { text: 'select.title.dictList', type: SelectionActionTypeEnum.SORT }
        ],
        disabled: canEdit,
      },
      {
        label: label('termTypeCode'),
        controlName: 'termTypeCode',
        type: 'select',
        required: true,
        options: this.dictionaryTermTypes.map(toLabeledValues),
        optionsActions: [
          { text: 'select.title.termTypesList', type: SelectionActionTypeEnum.SORT }
        ],
        disabled: canEdit,
      }
    ];

    return controls;
    // return this.filterControls(controls);
  }
}

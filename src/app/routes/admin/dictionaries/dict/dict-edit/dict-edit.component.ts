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
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';

import { IDictionary, ITerm } from '../../dictionaries.interface';
import { IDynamicFormControl, IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';
import { IMultiLanguageOption } from '../../../../../shared/components/form/multi-language/multi-language.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select.interface';

import { DictionariesService } from '../../dictionaries.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { makeKey, toLabeledValues, getTranslations } from '../../../../../core/utils';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

const label = makeKey('dictionaries.edit');

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() canEdit: boolean;
  @Input() dictionaries: IDictionary[];
  @Input() dictionaryTermTypes: ITerm[];
  @Input() dictionary: IDictionary;
  @Input() languages: ILookupLanguage[];
  @Input() title: string;

  @Output() cancel = new EventEmitter<null>();
  @Output() submit = new EventEmitter<null>();

  controls: Array<IDynamicFormItem> = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionariesService: DictionariesService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService
        .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DICTIONARY_TYPE),
      this.dictionary
        ? this.dictionariesService.selectedDictionary.map(dict => dict.name)
        : of([]),
    )
    .pipe(first())
    .subscribe(([dictTypeOptions, nameTranslations]) => {
      const dictNameTranslations = getTranslations(this.languages, nameTranslations);

      this.controls = this.getControls(dictTypeOptions, dictNameTranslations);
      this.cdRef.markForCheck();
    });
  }

  onSubmit(): any {
    this.submit.emit(this.form.serializedUpdates);
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onClose(): void {
    this.cancel.emit();
  }

  private getControls(
    dictTypeOptions: IOption[],
    nameTranslations: IMultiLanguageOption[],
  ): Array<IDynamicFormControl> {

    const disabled = !this.canEdit;
    const controls: IDynamicFormControl[] = [
      {
        label: label('code'),
        controlName: 'code',
        type: 'number',
        required: true,
        disabled,
      },
      {
        label: label('name'),
        controlName: 'name',
        type: this.dictionary ? 'multilanguage' : 'text',
        required: true,
        langOptions: nameTranslations,
        disabled,
      },
      {
        label: label('type'),
        controlName: 'typeCode',
        type: 'select',
        required: true,
        options: dictTypeOptions,
        disabled,
      },
      {
        label: label('parent'),
        controlName: 'parentCode',
        type: 'select',
        options: this.dictionaries.map(toLabeledValues),
        optionsActions: [
          { text: 'select.title.dictList', type: SelectionActionTypeEnum.SORT }
        ],
        disabled,
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
        disabled,
      }
    ];

    return controls;
  }
}

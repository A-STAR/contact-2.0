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
import { first } from 'rxjs/operators/first';

import { ITerm } from '../../dictionaries.interface';
import { IDynamicFormControl, IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';
import { IMultiLanguageOption } from '../../../../../shared/components/form/multi-language/multi-language.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select.interface';

import { DictionariesService } from '../../dictionaries.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, toLabeledValues, getTranslations } from '../../../../../core/utils';

const label = makeKey('terms.edit');

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() canEdit = false;
  @Input() disableParentSelection = false;
  @Input() languages: ILookupLanguage[];
  @Input() term: ITerm;
  @Input() terms: ITerm[];
  @Input() title: string;

  @Output() submit = new EventEmitter<ITerm>();
  @Output() cancel = new EventEmitter<null>();

  controls: Array<IDynamicFormItem>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionariesService: DictionariesService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService
        .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DICTIONARY_TYPE),
      this.term
        ? this.dictionariesService.selectedTerm.map(term => term.name)
        : of([]),
    )
    .pipe(first())
    .subscribe(([dictTypeOptions, nameTranslations]) => {
      const dictTermTranslations = getTranslations(this.languages, nameTranslations);
      this.controls = this.getControls(dictTypeOptions, dictTermTranslations);
      this.cdRef.markForCheck();
    });
  }

  onSubmit(values: ITerm): any {
    return this.submit.emit(this.form.serializedUpdates);
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
    const controls: Partial<IDynamicFormControl>[] = [
      {
        controlName: 'code',
        type: 'number',
        required: true,
        disabled,
      },
      {
        controlName: 'name',
        type: this.term ? 'multilanguage' : 'text',
        required: true,
        langOptions: nameTranslations,
        disabled,
      },
      {
        controlName: 'typeCode',
        type: 'select',
        required: true,
        options: dictTypeOptions,
        disabled,
      },
      {
        controlName: 'parentCode',
        disabled: this.disableParentSelection || disabled,
        type: 'select',
        options: this.terms.map(toLabeledValues),
        optionsActions: [
          { text: 'terms.edit.select.title', type: SelectionActionTypeEnum.SORT }
        ],
      },
      {
        controlName: 'isClosed',
        type: 'checkbox',
        disabled,
      }
    ];

    return controls.map(ctrl => ({ ...ctrl, label: label(ctrl.controlName) }) as IDynamicFormControl);
  }
}

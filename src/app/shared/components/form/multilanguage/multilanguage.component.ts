import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { ILookupLanguage } from '@app/core/lookup/lookup.interface';
import { IMultiLanguageConfig } from '@app/shared/components/form/multilanguage/multilanguage.interface';

import { DataService } from '@app/core/data/data.service';
import { LookupService } from '@app/core/lookup/lookup.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiLanguageComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiLanguageComponent),
      multi: true,
    },
  ],
  selector: 'app-multilanguage',
  styleUrls: [ './multilanguage.component.scss' ],
  templateUrl: './multilanguage.component.html',
})
export class MultiLanguageComponent implements ControlValueAccessor, OnInit, Validator {
  @Input() errors: any;
  @Input() isDisabled = false;
  @Input() isRequired = false;
  @Input() label: string;
  @Input() langConfig: IMultiLanguageConfig;

  languages: ILookupLanguage[] = [];
  value: any[] = [];

  private selectedLanguageId = 1;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private lookupService: LookupService,
  ) {}

  get selectedLanguageLabel(): string {
    const language = this.languages.find(l => l.id === this.selectedLanguageId);
    return language ? language.name : null;
  }

  get selectedTranslationLabel(): string {
    const translation = this.value.find(v => v.languageId === this.selectedLanguageId);
    return translation ? translation.value : null;
  }

  ngOnInit(): void {
    this.lookupService
      .lookup<ILookupLanguage>('languages')
      .subscribe(languages => {
        this.languages = languages;
        this.cdRef.markForCheck();
      });

    // This is where multilanguage controls get different from other controls.
    // We have to get value not from form but from server api.
    this.dataService
      .readTranslations(this.langConfig.entityId, this.langConfig.entityAttributeId)
      .subscribe(value => {
        this.value = value;
        this.propagateChange(value);
        this.cdRef.markForCheck();
      });
  }

  writeValue(value: any[]): void {
    //
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  validate(): any {
    switch (true) {
      case this.value == null && this.isRequired:
        return { required: true };
      default:
        return null;
    }
  }

  onChange(event: any): void {
    //
  }

  onFocusOut(): void {
    //
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}

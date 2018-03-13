import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

import { EntityTranslationsConstants, IEntityTranslation } from '@app/core/entity/translations/entity-translations.interface';
import { ILookupLanguage } from '@app/core/lookup/lookup.interface';
import { IMultiLanguageConfig } from '@app/shared/components/form/multilanguage/multilanguage.interface';

import { DataService } from '@app/core/data/data.service';
import { LookupService } from '@app/core/lookup/lookup.service';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

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

  @ViewChild('input') input: ElementRef;
  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  languages: ILookupLanguage[] = [];
  value: IEntityTranslation[] = [];

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
    if (Array.isArray(value)) {
      this.value = value;
      this.cdRef.markForCheck();
    }
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

  onChange(event: Event): void {
    const item = this.value.find(i => i.languageId === this.selectedLanguageId);
    if (item) {
      const { value } = event.target as HTMLInputElement;
      item.value = value;
      this.propagateChange(this.value);
    }
  }

  onFocusOut(): void {
    this.propagateTouch();
  }

  onLanguageSelect(language: any): void {
    this.selectedLanguageId = language.id;
    this.dropdown.close();
    this.input.nativeElement.focus();
    this.cdRef.markForCheck();
  }

  onLabelClick(event: MouseEvent): void {
    event.preventDefault();
    this.input.nativeElement.focus();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}

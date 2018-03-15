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
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IEntityTranslation } from '@app/core/entity/translations/entity-translations.interface';
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

  private mainLanguageId: number;
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
    const { entityId, entityAttributeId } = this.langConfig;

    combineLatest(
      this.lookupService.lookup<ILookupLanguage>('languages'),
      // This is where multilanguage controls get different from other controls.
      // We have to get value not from form but from server api.
      entityId && entityAttributeId
        ? this.dataService.readTranslations(entityId, entityAttributeId)
        : of(null),
    ).subscribe(([ languages, value ]) => {
      this.languages = languages;
      this.value = value || languages.map(l => ({ languageId: l.id, value: null }));

      const mainLanguage = languages.find(l => l.isMain === 1);
      if (mainLanguage) {
        this.mainLanguageId = mainLanguage.id;
      }

      this.propagateChange(this.value);
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
    const mainItem = this.mainLanguageId
      ? this.value.find(i => i.languageId === this.mainLanguageId)
      : null;

    switch (true) {
      case this.isRequired && mainItem && !mainItem.value:
        return { required: true };
      default:
        return null;
    }
  }

  onChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const item = this.value.find(i => i.languageId === this.selectedLanguageId);
    if (item) {
      item.value = value || null;
    } else {
      this.value.push({
        languageId: this.selectedLanguageId,
        value: value || null,
      });
    }
    this.propagateChange(this.value);
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

import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { first, map } from 'rxjs/operators';

import {
  IMetadataFormConfig,
  IMetadataFormControl,
  IMetadataFormControlType,
  IMetadataFormItem,
} from './metadata-form.interface';

import { ConfigService } from '@app/core/config/config.service';
import { ContextService } from '@app/core/context/context.service';

import { hasDigits, hasLowerCaseChars, hasUpperCaseChars } from '@app/core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-form',
  templateUrl: 'metadata-form.component.html'
})
export class MetadataFormComponent<T> implements OnInit {
  formGroup: FormGroup;
  initialized = false;

  @Input() config: IMetadataFormConfig | string;

  @Input()
  set data(data: T) {
    if (data) {
      this._data = data;
      this.populateForm();
    }
  }

  @Output() submit = new EventEmitter<void>();

  private _config: IMetadataFormConfig;
  private _data: T;

  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService,
    private contextService: ContextService,
    private httpClient: HttpClient,
  ) {}

  get formConfig(): IMetadataFormConfig {
    return this._config;
  }

  get canSubmit(): boolean {
    return this.formGroup && this.formGroup.valid && this.formGroup.dirty;
  }

  get data(): T {
    return this.formGroup && this.formGroup.value;
  }

  ngOnInit(): void {
    if (typeof this.config === 'string') {
      const { assets } = this.configService.config;
      const url = `${assets}/forms/${this.config}.json`;
      this.httpClient.get(url).subscribe((config: IMetadataFormConfig) => {
        this.init(config);
      });
    } else {
      this.init(this.config);
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit();
  }

  private getAsyncValidators(control: IMetadataFormControl): AsyncValidatorFn[] {
    return Object.keys(control.validators || {}).map(key => {
      const value = control.validators[key];
      return typeof value === 'object' && value !== null
        ? c => this.contextService.calculate(value).pipe(
            map(v => this.getValidator(key, v)),
            map(v => v ? v(c) : null),
            first(),
          )
        : c => of(this.getValidator(key, value)(c));
    });
  }

  private getValidator(key: string, value: any): ValidatorFn {
    switch (key) {
      case 'complexity':
        return value ? Validators.compose([ hasDigits, hasLowerCaseChars, hasUpperCaseChars ]) : null;
      case 'required':
        return value ? Validators.required : null;
      case 'minLength':
        return Validators.minLength(value);
      case 'maxLength':
        return Validators.maxLength(value);
      default:
        return null;
    }
  }

  private flattenControls(items: IMetadataFormItem[]): IMetadataFormControl[] {
    return items.reduce((acc, item) => [
      ...acc,
      ...(item.type === IMetadataFormControlType.GROUP ? this.flattenControls(item.children) : [item]),
    ], []);
  }

  private populateForm(): void {
    if (this.formGroup && this._data) {
      this.formGroup.patchValue(this._data);
    }
  }

  private disable(name: string, disabled: boolean): void {
    const control = this.formGroup.get(name);
    if (disabled) {
      control.disable();
    } else {
      control.enable();
    }
  }

  private init(config: IMetadataFormConfig): void {
    this._config = config;

    const flatControls = this.flattenControls(config.items);

    const controls = flatControls.reduce((acc, item) => {
      const asyncValidators = this.getAsyncValidators(item);
      const disabled = item.disabled === true;
      return {
        ...acc,
        [item.name]: new FormControl({ value: null, disabled }, { asyncValidators })
      };
    }, {});

    this.formGroup = new FormGroup(controls);

    flatControls.forEach(item => {
      if (typeof item.disabled === 'object' && item.disabled !== null) {
        this.contextService
          .calculate(item.disabled)
          .subscribe((d: boolean) => this.disable(item.name, d));
      }
    });

    this.populateForm();

    this.initialized = true;
    this.cdRef.markForCheck();
  }
}

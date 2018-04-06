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
import { MetadataFormService } from './metadata-form.service';

import { hasDigits, hasLowerCaseChars, hasUpperCaseChars } from '@app/core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MetadataFormService,
  ],
  selector: 'app-metadata-form',
  templateUrl: 'metadata-form.component.html'
})
export class MetadataFormComponent<T> implements OnInit {
  formGroup: FormGroup;
  initialized = false;

  @Input() config: IMetadataFormConfig | string;

  @Input()
  set data(data: Partial<T>) {
    if (data) {
      this._data = data;
      this.populateForm();
    }
  }

  @Output() submit = new EventEmitter<void>();

  private _config: IMetadataFormConfig;
  private _data: Partial<T>;

  private flatControls: IMetadataFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService,
    private contextService: ContextService,
    private httpClient: HttpClient,
    private metadataFormService: MetadataFormService,
  ) {}

  get formConfig(): IMetadataFormConfig {
    return this._config;
  }

  get canSubmit(): boolean {
    return this.formGroup && this.formGroup.valid && this.formGroup.dirty;
  }

  get data(): Partial<T> {
    return this.formGroup
      ? this.fromFormValue(this.formGroup.value)
      : null;
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

  private init(config: IMetadataFormConfig): void {
    this._config = config;

    this.flatControls = this.flattenControls(config.items);

    const controls = this.flatControls.reduce((acc, item) => {
      const asyncValidators = this.getAsyncValidators(item);
      const disabled = item.disabled === true;
      return {
        ...acc,
        [item.name]: new FormControl({ value: null, disabled }, { asyncValidators })
      };
    }, {});

    this.formGroup = new FormGroup(controls);

    this.metadataFormService.setPlugins(this.formGroup, config.plugins);

    this.flatControls.forEach(item => {
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
      const formValue = this.toFormValue(this._data);
      this.formGroup.patchValue(formValue);
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

  private toFormValue(data: Partial<T>): any {
    return data;
  }

  private fromFormValue(value: any): Partial<T> {
    return value;
  }
}

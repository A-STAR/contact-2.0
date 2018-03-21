import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { first, map } from 'rxjs/operators';

import {
  IMetadataFormConfig,
  IMetadataFormControl,
  IMetadataFormControlType,
  IMetadataFormItem,
} from './metadata-form.interface';

import { ContextService } from '@app/core/context/context.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-form',
  templateUrl: 'metadata-form.component.html'
})
export class MetadataFormComponent<T> implements OnInit {
  formGroup: FormGroup;

  @Input() config: IMetadataFormConfig;

  @Input()
  set data(data: T) {
    if (data) {
      this._data = data;
      this.populateForm();
    }
  }

  private _data: T;

  constructor(
    private contextService: ContextService,
  ) {}

  ngOnInit(): void {
    const controls = this.flattenControls(this.config.items).reduce((acc, item) => ({
      ...acc,
      [item.name]: new FormControl(null, { asyncValidators: this.getAsyncValidators(item as any) })
    }), {});
    this.formGroup = new FormGroup(controls);
    this.populateForm();
  }

  private getAsyncValidators(control: IMetadataFormControl): AsyncValidatorFn[] {
    return Object.keys(control.validators || {}).map(key => {
      const value = control.validators[key];
      return typeof value === 'object' && value !== null
        ? c => this.contextService.calculate(value).pipe(
            map(v => this.getValidator(key, v)(c)),
            first(),
          )
        : c => of(this.getValidator(key, value)(c));
    });
  }

  private getValidator(key: string, value: any): ValidatorFn {
    switch (key) {
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
}

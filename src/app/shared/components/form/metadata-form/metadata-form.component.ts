import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { first, map } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import { IMetadataFormConfig, IMetadataFormControl } from './metadata-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-form',
  templateUrl: 'metadata-form.component.html'
})
export class MetadataFormComponent implements OnInit {
  formGroup: FormGroup;

  @Input() config: IMetadataFormConfig;

  constructor(
    private store: Store<IAppState>,
  ) {}

  ngOnInit(): void {
    const controls = this.config.items.reduce((acc, item) => ({
      ...acc,
      [item['name']]: new FormControl('', { asyncValidators: this.getAsyncValidators(item as any) })
    }), {});
    this.formGroup = new FormGroup(controls);
  }

  getErrors(control: IMetadataFormControl): any {
    const c = this.formGroup.get(control.name);
    return c.touched ? c.errors : null;
  }

  // getValidator<T>(validator: IMetadataFormValidator<T>): Observable<T> {
  //   return typeof validator === 'string'
  //     ? this.store.pipe(select(state => this.getSlice(state, validator)))
  //     : of(validator);
  // }

  private getAsyncValidators(control: IMetadataFormControl): AsyncValidatorFn[] {
    return Object.keys(control.validators || {}).map(key => {
      const value = control.validators[key];
      return typeof value === 'string'
        ? c => this.store.pipe(
            select(state => this.getSlice(state, value)),
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

  private getSlice(object: any, path: string): any {
    return path.split('/').reduce((acc, chunk) => acc && acc[chunk], object);
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import {
  IMetadataFormControl,
  IMetadataFormGridSelectControl,
  IMetadataFormItem,
  IMetadataFormValidator,
} from '../metadata-form.interface';

import { ContextService } from '@app/core/context/context.service';
import { MetadataFormService } from '../metadata-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-form-item',
  styleUrls: [ 'metadata-form-item.component.scss' ],
  templateUrl: 'metadata-form-item.component.html'
})
export class MetadataFormItemComponent {
  static DEFAULT_MESSAGES = {
    required: 'validation.fieldRequired',
    min: 'validation.fieldMin',
    max: 'validation.fieldMax',
    minlength: 'validation.fieldMinLength',
    hasdigits: 'validation.fieldDigits',
    haslowercasechars: 'validation.fieldLowerCase',
    hasuppercasechars: 'validation.fieldUpperCase',
    multilanguageRequired: 'validation.multilanguageRequired',
    maxsize: 'validation.fieldMaxSize',
    oneofgrouprequired: 'validation.oneOfGroupRequired',
    datepicker: 'validation.datepicker',
    timepicker: 'validation.timepicker'
  };

  @Input() editable: boolean;
  @Input() formGroup: FormGroup;
  @Input() item: IMetadataFormItem;
  @Input() suppressLabel = false;

  constructor(
    private contextService: ContextService,
    private metadataFormService: MetadataFormService,
  ) {}

  isRequired(control: IMetadataFormControl): Observable<boolean> {
    // TODO(d.maltsev): should be readonly property for each control
    return this.calculateContextValue(control.validators['required']);
  }

  getErrorMessage(control: IMetadataFormControl): any {
    const c = this.formGroup.get(control.name);
    return c.errors && (c.touched || c.dirty)
      ? this.getErrorMessageForControl(c)
      : { message: null, data: null };
  }

  onGridSelect(control: IMetadataFormGridSelectControl, event: any): void {
    this.metadataFormService.onGridSelect(control, event);
  }

  private getErrorMessageForControl(c: AbstractControl): any {
    const keys = Object.keys(c.errors);
    return keys.length
      ? { message: MetadataFormItemComponent.DEFAULT_MESSAGES[keys[0]] || keys[0], data: c.errors[keys[0]] }
      : { message: null, data: null };
  }

  private calculateContextValue(validator: IMetadataFormValidator<any>): Observable<boolean> {
    return typeof validator === 'object' && validator !== null
      ? this.contextService.calculate(validator).pipe(
          map(Boolean),
        )
      : of(validator);
  }
}

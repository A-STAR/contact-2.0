import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
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
  selector: 'app-metadata-form-group',
  styleUrls: [ 'metadata-form-group.component.scss' ],
  templateUrl: 'metadata-form-group.component.html'
})
export class MetadataFormGroupComponent {
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

  @HostBinding('class.bordered')
  @Input()
  border: boolean;

  @Input() editable: boolean;
  @Input() formGroup: FormGroup;
  @Input() items: IMetadataFormItem[];
  @Input() label: string;

  constructor(
    private contextService: ContextService,
    private metadataFormService: MetadataFormService,
  ) {}

  isDisplayed(item: IMetadataFormItem): Observable<boolean> {
    // TODO(d.maltsev): should be readonly property for each control
    return this.calculateContextValue(item.display);
  }

  isRequired(control: IMetadataFormControl): Observable<boolean> {
    // TODO(d.maltsev): should be readonly property for each control
    return this.calculateContextValue(control.validators['required']);
  }

  getItemStyle(width: number): Partial<CSSStyleDeclaration> {
    return width
      ? { flex: width.toString() }
      : { flexBasis: '100%' };
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
      ? { message: MetadataFormGroupComponent.DEFAULT_MESSAGES[keys[0]] || keys[0], data: c.errors[keys[0]] }
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

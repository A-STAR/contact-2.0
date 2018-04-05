import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { IMetadataFormControl, IMetadataFormItem } from '../metadata-form.interface';

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

  @Input() editable: boolean;
  @Input() formGroup: FormGroup;
  @Input() items: IMetadataFormItem[];

  constructor(
    private metadataFormService: MetadataFormService,
  ) {}

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

  onGridSelect(event: any): void {
    this.metadataFormService.onGridSelect(event);
  }

  private getErrorMessageForControl(c: AbstractControl): any {
    const keys = Object.keys(c.errors);
    return keys.length
      ? { message: MetadataFormGroupComponent.DEFAULT_MESSAGES[keys[0]] || keys[0], data: c.errors[keys[0]] }
      : { message: null, data: null };
  }
}

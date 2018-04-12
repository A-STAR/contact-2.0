import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {
  IMetadataFormFlatConfig,
  IMetadataFormGroupType,
  IMetadataFormItem,
  IMetadataFormControlType,
} from '../metadata-form.interface';

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
  @Input() flatConfig: IMetadataFormFlatConfig;
  @Input() formGroup: FormGroup;
  @Input() groupType: IMetadataFormGroupType;
  @Input() items: IMetadataFormItem[];
  @Input() label: string;
  @Input() suppressLabel = false;

  isDisplayed(item: IMetadataFormItem): Observable<boolean> {
    return item.type === IMetadataFormControlType.GROUP
      ? of(true)
      : this.flatConfig[item.name].display;
  }

  getItemStyle(width: number): Partial<CSSStyleDeclaration> {
    return width
      ? { flex: width.toString() }
      : { flexBasis: '100%' };
  }
}

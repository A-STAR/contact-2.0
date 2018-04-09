import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import {
  IMetadataFormItem,
  IMetadataFormValidator,
  IMetadataFormGroupType,
} from '../metadata-form.interface';

import { ContextService } from '@app/core/context/context.service';

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
  @Input() groupType: IMetadataFormGroupType;
  @Input() items: IMetadataFormItem[];
  @Input() label: string;
  @Input() suppressLabel = false;

  constructor(
    private contextService: ContextService,
  ) {}

  isDisplayed(item: IMetadataFormItem): Observable<boolean> {
    // TODO(d.maltsev): should be readonly property for each control
    return this.calculateContextValue(item.display);
  }

  getItemStyle(width: number): Partial<CSSStyleDeclaration> {
    return width
      ? { flex: width.toString() }
      : { flexBasis: '100%' };
  }

  private calculateContextValue(validator: IMetadataFormValidator<any>): Observable<boolean> {
    return typeof validator === 'object' && validator !== null
      ? this.contextService.calculate(validator).pipe(
          map(Boolean),
        )
      : of(validator);
  }
}

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { PhoneService } from '../phone.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-phone-card',
  templateUrl: './phone-card.component.html'
})
export class PhoneCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;
  private phoneId = (this.route.params as any).value.phoneId || null;

  controls: Array<IDynamicFormItem> = null;
  phone: any;

  constructor(
    private phoneService: PhoneService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PHONE_TYPE),
      this.userPermissionsService.has('PHONE_EDIT'),
      this.userPermissionsService.has('PHONE_COMMENT_EDIT'),
      // TODO(d.maltsev): pass entity type
      this.phoneId ? this.phoneService.fetch(18, this.id, this.phoneId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ options, canEdit, canEditComment, phone ]) => {
      this.controls = [
        { label: 'widgets.phone.card.typeCode', controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
        { label: 'widgets.phone.card.phoneNumber', controlName: 'phone', type: 'text', required: true, disabled: !canEdit },
        { label: 'widgets.phone.card.stopAutoSms', controlName: 'stopAutoSms', type: 'checkbox' },
        { label: 'widgets.phone.card.stopAutoInfo', controlName: 'stopAutoInfo', type: 'checkbox' },
        { label: 'widgets.phone.card.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
      ];
      this.phone = phone;
    });
  }

  public onSubmit(): void {
    const { value } = this.form;
    const data = {
      ...value,
      typeCode: Array.isArray(value.typeCode) ? value.typeCode[0].value : value.typeCode
    }
    if (this.phoneId) {
      this.phoneService.update(18, this.id, this.phoneId, data).subscribe();
    } else {
      this.phoneService.create(18, this.id, data).subscribe();
    }
  }

  public onBack(): void {
    console.log('back');
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

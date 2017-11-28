import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPhone } from '../phone.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { PhoneService } from '../phone.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.phone.card');

@Component({
  selector: 'app-phone-card',
  templateUrl: './phone-card.component.html'
})
export class PhoneCardComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  private queryParams = (<any>this.route.queryParams).value;
  private personId = this.routeParams.personId || null;
  private contactId = this.routeParams.contactId || null;
  private phoneId = this.routeParams.phoneId || null;
  private callCenter = this.queryParams.callCenter;

  controls: Array<IDynamicFormItem> = null;
  phone: IPhone;

  constructor(
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private phoneService: PhoneService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // NOTE: on deper routes we should take the contactId
    this.personId = this.contactId || this.personId;

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PHONE_TYPE),
      this.phoneId ? this.userPermissionsService.has('PHONE_EDIT') : Observable.of(true),
      this.phoneId ? this.userPermissionsService.has('PHONE_COMMENT_EDIT') : Observable.of(true),
      this.phoneId ? this.phoneService.fetch(18, this.personId, this.phoneId, this.callCenter) : Observable.of(null)
    )
    .pipe(first())
    .subscribe(([ options, canEdit, canEditComment, phone ]) => {
      this.controls = [
        { label: labelKey('typeCode'), controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
        { label: labelKey('phoneNumber'), controlName: 'phone', type: 'text', required: true, disabled: !canEdit },
        { label: labelKey('stopAutoSms'), controlName: 'stopAutoSms', type: 'checkbox', disabled: !canEdit },
        { label: labelKey('stopAutoInfo'), controlName: 'stopAutoInfo', type: 'checkbox', disabled: !canEdit },
        { label: labelKey('comment'), controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
      ];
      this.phone = phone;
    });
  }

  onSubmit(): void {
    const action = this.phoneId
      ? this.phoneService.update(18, this.personId, this.phoneId, this.callCenter, this.form.serializedUpdates)
      : this.phoneService.create(18, this.personId, this.callCenter, this.form.serializedUpdates);

    action.subscribe(() => {
      this.messageBusService.dispatch(PhoneService.MESSAGE_PHONE_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.contentTabService.back();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

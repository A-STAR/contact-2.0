import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';

import { PhoneService } from '@app/routes/workplaces/core/phone/phone.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const labelKey = makeKey('widgets.phone.card');

@Component({
  selector: 'app-phone-card',
  templateUrl: './phone-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[] = null;
  phone: IPhone;

  private routeParamMap = this.route.snapshot.paramMap;
  private routeData = this.route.snapshot.data;

  private callCenter = this.routeData.callCenter;
  private entityKey = this.routeData.entityKey || 'entityId';
  private parentUrl = this.routeData.parentUrl;

  private phoneId = Number(this.routeParamMap.get('phoneId'));
  private entityId = Number(this.routeParamMap.get(this.entityKey));

  constructor(
    private cdRef: ChangeDetectorRef,
    private phoneService: PhoneService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PHONE_TYPE),
      this.phoneId ? this.userPermissionsService.has('PHONE_EDIT') : of(true),
      this.phoneId ? this.userPermissionsService.has('PHONE_COMMENT_EDIT') : of(true),
      this.phoneId ? this.phoneService.fetch(18, this.entityId, this.phoneId, this.callCenter) : of(null)
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
      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const action = this.phoneId
      ? this.phoneService.update(18, this.entityId, this.phoneId, this.callCenter, this.form.serializedUpdates)
      : this.phoneService.create(18, this.entityId, this.callCenter, this.form.serializedUpdates);

    action.subscribe(() => {
      this.phoneService.dispatchAction(PhoneService.MESSAGE_PHONE_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    if (this.parentUrl) {
      this.routingService.navigateToUrl(this.parentUrl);
    } else {
      this.routingService.navigateToParent(this.route);
    }
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}

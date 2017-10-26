import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IProperty } from '../property.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { PropertyService } from '../property.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.property.card');

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html'
})
export class PropertyCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  private personId = (this.route.params as any).value.personId || null;

  controls: Array<IDynamicFormItem> = null;
  propertyItem: IProperty;

  constructor(
    private contentTabService: ContentTabService,
    private propertyService: PropertyService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userPermissionsService.has('PROPERTY_ADD'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROPERTY_TYPE),
    )
    .take(1)
    .subscribe(([ canEdit, respTypeOpts ]) => {
      this.controls = this.initControls(canEdit, respTypeOpts);
      this.propertyItem = this.getFormData();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.propertyService.create(this.personId, this.form.requestValue);

    action.subscribe(() => {
      this.messageBusService.dispatch(PropertyService.PROPERTY_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.contentTabService.back();
  }

  private initControls(canEdit: boolean, propertyTypeOptions: IOption[]): Array<IDynamicFormItem> {
    return [
      { label: label('name'), controlName: 'name', type: 'text', disabled: !canEdit },
      {
        label: label('propertyType'), controlName: 'propertyType',
        type: 'select', options: propertyTypeOptions, required: true, disabled: !canEdit
      },
      { label: label('isConfirmed'), controlName: 'isConfirmed', type: 'checkbox', disabled: !canEdit },
      { label: label('comment'), controlName: 'comment', type: 'textarea', disabled: !canEdit },
    ];
  }

  private getFormData(): IProperty {
    return {
      propertyType: 1
    };
  }
}

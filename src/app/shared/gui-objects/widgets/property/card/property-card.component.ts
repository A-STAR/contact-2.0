import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IProperty } from '../property.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { PropertyService } from '../property.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.property.card');

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyCardComponent implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  private personId = (this.route.params as any).value.personId || null;
  private propertyId = (this.route.params as any).value.propertyId || null;

  controls: Array<IDynamicFormItem> = null;
  property: IProperty;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.propertyId ? this.propertyService.canEdit$ : this.propertyService.canAdd$,
      this.propertyId ? this.propertyService.fetch(this.personId, this.propertyId) : of(this.getFormData()),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROPERTY_TYPE),
    )
    .pipe(first())
    .subscribe(([ canEdit, property, respTypeOpts ]) => {
      this.controls = this.initControls(canEdit, respTypeOpts);
      this.property = property;
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.propertyId
      ? this.propertyService.update(this.personId, this.propertyId, this.form.serializedUpdates)
      : this.propertyService.create(this.personId, this.form.serializedUpdates);

    action.subscribe(() => {
      this.propertyService.dispatchAction(PropertyService.MESSAGE_PROPERTY_SAVED);
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
        label: label('propertyType'), controlName: 'typeCode', type: 'select',
        options: propertyTypeOptions, required: true, disabled: !canEdit, markAsDirty: !this.propertyId
      },
      { label: label('isConfirmed'), controlName: 'isConfirmed', type: 'checkbox', disabled: !canEdit },
      { label: label('comment'), controlName: 'comment', type: 'textarea', disabled: !canEdit },
    ];
  }

  private getFormData(): IProperty {
    return {
      typeCode: 1
    };
  }
}

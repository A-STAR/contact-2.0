import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPledgerProperty } from '../pledger-property.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { PledgeService } from '../../pledge/pledge.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.pledgerProperty.card');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledger-property-card',
  templateUrl: './pledger-property-card.component.html'
})
export class PledgerPropertyCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormGroup[] = null;
  property: IPledgerProperty;
  typeCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgeService: PledgeService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {
  }

  ngOnInit(): void {
    Observable.combineLatest(
      this.lookupService.currencyOptions,
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROPERTY_TYPE),
      this.pledgeService.canAdd$,
      Observable.of(this.getFormData())
    )
    .take(1)
    .subscribe(([ currencyOptions, propertyTypeOptions, canEdit, property ]) => {
      this.initControls(canEdit, propertyTypeOptions, currencyOptions);
      this.property = property;
      this.cdRef.markForCheck();
    });
  }

  private initControls(canEdit: boolean, propertyTypeOptions: IOption[], currencyOptions: IOption[]): void {
    this.controls = [
      {
        title: 'widgets.pledgerProperty.title',
        collapsible: true,
        children: [
          {
            label: label('propertyType'), controlName: 'propertyType', type: 'select',
            options: propertyTypeOptions, required: true, markAsDirty: true
          },
          { label: label('pledgeValue'), controlName: 'pledgeValue', type: 'text' },
          { label: label('marketValue'), controlName: 'marketValue', type: 'text' },
          {
            label: label('currencyId'), controlName: 'currencyId', type: 'select',
            options: currencyOptions, required: true, markAsDirty: true
          },
        ]
      },
    ];

    this.controls = this.controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
  }

  private getFormData(): IPledgerProperty {
    return {
      propertyType: 1,
      currencyId: 1
    };
  }
}

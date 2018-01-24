import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { RoutingService } from '@app/core/routing/routing.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first, map, distinctUntilChanged } from 'rxjs/operators';

import { IProperty } from '../property.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { DebtorCardService } from '../../../../../core/app-modules/debtor-card/debtor-card.service';
import { PropertyService } from '../property.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';
import { Observable } from 'rxjs/Observable';

interface IPropertyCardRouteParams {
  personId: number;
  propertyId: number;
}

const label = makeKey('widgets.property.card');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
})
export class PropertyCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() personId: number;
  @Input() propertyId: number;

  controls: Array<IDynamicFormItem> = null;
  property: IProperty;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private propertyService: PropertyService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService
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

  get propertyId$(): Observable<number> {
    return this.routeParams$.map(params => params.propertyId);
  }

  get personId$(): Observable<number> {
    return combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .pipe(
        map(([ personId, params ]) => params.personId || personId),
        distinctUntilChanged(),
      );
  }

  get routeParams$(): Observable<IPropertyCardRouteParams> {
    return <Observable<IPropertyCardRouteParams>>this.route.params.distinctUntilChanged();
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
    this.routingService.navigate([ `/workplaces/debtor-card/${this.route.snapshot.paramMap.get('debtId')}` ], this.route);
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

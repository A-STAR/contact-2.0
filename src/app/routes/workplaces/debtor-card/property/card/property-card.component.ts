import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first, map, distinctUntilChanged } from 'rxjs/operators';

import { IProperty } from '@app/routes/workplaces/core/property/property.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';
import { Observable } from 'rxjs/Observable';

interface IPropertyCardRouteParams {
  personId: number;
  propertyId: number;
}

const label = makeKey('widgets.property.card');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-property-card',
  templateUrl: './property-card.component.html',
})
export class DebtorPropertyCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  property: IProperty;

  private propertyId = Number(this.route.snapshot.paramMap.get('propertyId'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.propertyId ? this.propertyService.canEdit$ : this.propertyService.canAdd$,
      this.propertyId
        ? this.debtorCardService.personId$.flatMap(personId => this.propertyService.fetch(personId, this.propertyId))
        : of(this.getFormData()),
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
    const action = this.debtorCardService.personId$.flatMap(personId => this.propertyId
      ? this.propertyService.update(personId, this.propertyId, this.form.serializedUpdates)
      : this.propertyService.create(personId, this.form.serializedUpdates)
    );

    action.subscribe(() => {
      this.propertyService.dispatchAction(PropertyService.MESSAGE_PROPERTY_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.routingService.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
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

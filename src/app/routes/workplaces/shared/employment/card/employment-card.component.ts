import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployment } from '@app/routes/workplaces/core/employment/employment.interface';

import { EmploymentService } from '@app/routes/workplaces/core/employment/employment.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.employment.grid');

@Component({
  selector: 'app-employment-card',
  templateUrl: './employment-card.component.html'
})
export class EmploymentCardComponent implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  controls: IDynamicFormControl[] = null;
  employment: IEmployment;

  private routeParamMap = this.route.snapshot.paramMap;
  private routeData = this.route.snapshot.data;

  private entityKey = this.routeData.entityKey || 'entityId';
  private parentUrl = this.routeData.parentUrl;

  private employmentId = Number(this.routeParamMap.get('employmentId'));
  private entityId = Number(this.routeParamMap.get(this.entityKey));

  constructor(
    private cdRef: ChangeDetectorRef,
    private employmentService: EmploymentService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_WORK_TYPE),
      this.lookupService.currencyOptions,
      this.employmentId
        ? this.userPermissionsService.has('EMPLOYMENT_EDIT')
        : this.userPermissionsService.has('EMPLOYMENT_ADD'),
      this.employmentId ? this.employmentService.fetch(this.entityId, this.employmentId) : of(null)
    )
    .pipe(first())
    .subscribe(([ options, currencyOptions, canEdit, employment ]) => {
      const controls: IDynamicFormControl[] = [
        { label: label('workTypeCode'), controlName: 'workTypeCode', type: 'select', options, required: true },
        { label: label('company'), controlName: 'company',  type: 'text', required: true },
        { label: label('position'), controlName: 'position',  type: 'text', },
        { label: label('hireDate'), controlName: 'hireDate', type: 'datepicker', },
        { label: label('dismissDate'), controlName: 'dismissDate', type: 'datepicker', },
        { label: label('income'), controlName: 'income',  type: 'number', },
        { label: label('currencyId'), controlName: 'currencyId', type: 'select', options: currencyOptions },
        { label: label('comment'), controlName: 'comment', type: 'textarea', },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true });
      this.employment = employment;
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onBack(): void {
    if (this.parentUrl) {
      this.routingService.navigateToUrl(this.parentUrl);
    } else {
      this.routingService.navigateToParent(this.route);
    }
  }

  onSubmit(): void {
    const data = this.form.serializedUpdates;
    const action = this.employmentId
      ? this.employmentService.update(this.entityId, this.employmentId, data)
      : this.employmentService.create(this.entityId, data);

    action.subscribe(() => {
      this.employmentService.dispatchAction(EmploymentService.MESSAGE_EMPLOYMENT_SAVED);
      this.onBack();
    });
  }
}

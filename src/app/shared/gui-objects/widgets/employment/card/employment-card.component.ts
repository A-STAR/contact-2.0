import { Component, ViewChild, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployment } from '@app/shared/gui-objects/widgets/employment/employment.interface';

import { EmploymentService } from '@app/shared/gui-objects/widgets/employment/employment.service';
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

  @Input() personId: number;
  @Input() employmentId: number;

  controls: IDynamicFormControl[] = null;
  employment: IEmployment;

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
      this.employmentId ? this.employmentService.fetch(this.personId, this.employmentId) : of(null)
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
    const contactSegments = this.route.snapshot.paramMap.get('contactId')
      ? [ 'contact', this.route.snapshot.paramMap.get('contactId') ]
      : [];
    this.routingService.navigate([
      '/workplaces',
      'debtor-card',
      this.route.snapshot.paramMap.get('debtId'),
      ...contactSegments
    ]);
  }

  onSubmit(): void {
    const data = this.form.serializedUpdates;
    const action = this.employmentId
      ? this.employmentService.update(this.personId, this.employmentId, data)
      : this.employmentService.create(this.personId, data);

    action.subscribe(() => {
      this.employmentService.dispatchAction(EmploymentService.MESSAGE_EMPLOYMENT_SAVED);
      this.onBack();
    });
  }
}

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IEmployment } from '../employment.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { EmploymentService } from '../employment.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-employment-card',
  templateUrl: './employment-card.component.html'
})
export class EmploymentCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  private personId = this.routeParams.id || null;
  private contactId = this.routeParams.contactId || null;
  private employmentId = this.routeParams.employmentId || null;

  controls: IDynamicFormControl[] = null;
  employment: IEmployment;

  constructor(
    private contentTabService: ContentTabService,
    private employmentService: EmploymentService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // NOTE: on deper routes we should take the contactId
    this.personId = this.contactId || this.personId;

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_WORK_TYPE),
      this.lookupService.currencyOptions,
      this.employmentId
        ? this.userPermissionsService.has('EMPLOYMENT_EDIT')
        : this.userPermissionsService.has('EMPLOYMENT_ADD'),
      this.employmentId ? this.employmentService.fetch(this.personId, this.employmentId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ options, currencyOptions, canEdit, employment ]) => {
      const controls: IDynamicFormControl[] = [
        { label: 'widgets.employment.grid.workTypeCode', controlName: 'workTypeCode', type: 'select', options, required: true },
        { label: 'widgets.employment.grid.company', controlName: 'company',  type: 'text', required: true },
        { label: 'widgets.employment.grid.position', controlName: 'position',  type: 'text', },
        { label: 'widgets.employment.grid.hireDate', controlName: 'hireDate', type: 'datepicker', },
        { label: 'widgets.employment.grid.dismissDate', controlName: 'dismissDate', type: 'datepicker', },
        { label: 'widgets.employment.grid.income', controlName: 'income',  type: 'number', },
        { label: 'widgets.employment.grid.currencyId', controlName: 'currencyId', type: 'select', options: currencyOptions },
        { label: 'widgets.employment.grid.comment', controlName: 'comment', type: 'textarea', },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true });
      this.employment = employment;
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onBack(): void {
    this.contentTabService.back();
  }

  onSubmit(): void {
    const data = this.form.requestValue;
    const action = this.employmentId
      ? this.employmentService.update(this.personId, this.employmentId, data)
      : this.employmentService.create(this.personId, data);

    action.subscribe(() => {
      this.messageBusService.dispatch(EmploymentService.MESSAGE_EMPLOYMENT_SAVED);
      this.onBack();
    });
  }
}

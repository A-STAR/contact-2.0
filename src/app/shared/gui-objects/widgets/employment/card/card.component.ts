import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IEmployment } from '../employment.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { EmploymentService } from '../employment.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-employment-card',
  templateUrl: './card.component.html'
})
export class EmploymentCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  // private dialog: string;
  private personId = (this.route.params as any).value.id || null;
  private identityId = (this.route.params as any).value.identityId || null;

  controls: IDynamicFormControl[] = null;
  employment: IEmployment;

  constructor(
    private contentTabService: ContentTabService,
    private employmentService: EmploymentService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_IDENTITY_TYPE),
      this.identityId
        ? this.userPermissionsService.has('IDENTITY_DOCUMENT_EDIT')
        : this.userPermissionsService.has('IDENTITY_DOCUMENT_ADD'),
      this.identityId ? this.employmentService.fetch(this.personId, this.identityId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ options, canEdit, employment ]) => {
      this.controls = ([
        { label: 'debtor.identityDocs.grid.docTypeCode', controlName: 'docTypeCode', type: 'select', options, required: true, },
        { label: 'debtor.identityDocs.grid.docNumber', controlName: 'docNumber',  type: 'text', required: true, },
        { label: 'debtor.identityDocs.grid.issueDate', controlName: 'issueDate', type: 'datepicker', },
        { label: 'debtor.identityDocs.grid.issuePlace', controlName: 'issuePlace', type: 'text', },
        { label: 'debtor.identityDocs.grid.expiryDate', controlName: 'expiryDate', type: 'datepicker', },
        { label: 'debtor.identityDocs.grid.citizenship', controlName: 'citizenship', type: 'text', },
        { label: 'debtor.identityDocs.grid.comment', controlName: 'comment', type: 'textarea', },
      ] as IDynamicFormControl[])
      .map(control => canEdit ? control : { ...control, disabled: true });
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
    const action = this.identityId
      ? this.employmentService.update(this.personId, this.identityId, data)
      : this.employmentService.create(this.personId, data);

    action.subscribe(() => {
      this.messageBusService.dispatch(EmploymentService.MESSAGE_EMPLOYMENT_SAVED);
      this.onBack();
    });
  }
}

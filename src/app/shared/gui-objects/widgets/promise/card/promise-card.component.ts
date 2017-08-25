import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPromise } from '../promise.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { PromiseService } from '../promise.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-promise-card',
  templateUrl: './promise-card.component.html'
})
export class PromiseCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  private personId = this.routeParams.id || null;
  private contactId = this.routeParams.contactId || null;
  private promiseId = this.routeParams.promiseId || null;

  controls: IDynamicFormControl[] = null;
  promise: IPromise;

  constructor(
    private contentTabService: ContentTabService,
    private promiseService: PromiseService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.personId = this.contactId || this.personId;
    console.log('route params', this.routeParams);

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROMISE_STATUS),
      this.lookupService.currencyOptions,
      this.promiseId
        ? this.userPermissionsService.has('PROMISE_EDIT')
        : this.userPermissionsService.has('PROMISE_ADD'),
      this.promiseId ? this.promiseService.fetch(this.personId, this.promiseId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ options, currencyOptions, canEdit, promise ]) => {
      const controls: IDynamicFormControl[] = [
        { label: 'widgets.promise.grid.promiseDate', controlName: 'promiseDate', type: 'datepicker', },
        { label: 'widgets.promise.grid.promiseSum', controlName: 'promiseSum',  type: 'number', },
        { label: 'widgets.promise.grid.receiveDateTime', controlName: 'receiveDateTime', type: 'datepicker', },
        // { label: 'widgets.promise.grid.currencyId', controlName: 'currencyId', type: 'select', options: currencyOptions },
        { label: 'widgets.promise.grid.comment', controlName: 'comment', type: 'textarea', },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true });
      this.promise = promise;
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
    const action = this.promiseId
      ? this.promiseService.update(this.personId, this.promiseId, data)
      : this.promiseService.create(this.personId, data);

    action.subscribe(() => {
      this.messageBusService.dispatch(PromiseService.MESSAGE_PROMISE_SAVED);
      this.onBack();
    });
  }
}

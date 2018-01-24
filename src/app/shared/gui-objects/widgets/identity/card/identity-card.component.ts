import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '@app/core/routing/routing.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IIdentityDoc } from '../identity.interface';

import { IdentityService } from '../identity.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../../core/dialog';
import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('debtor.identityDocs.grid');

@Component({
  selector: 'app-identity-card',
  templateUrl: './identity-card.component.html'
})
export class IdentityCardComponent extends DialogFunctions implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  @Input() personId: number;
  @Input() identityId: number;

  controls: IDynamicFormControl[] = null;
  dialog: string;
  identity: IIdentityDoc;

  constructor(
    private identityService: IdentityService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_IDENTITY_TYPE),
      this.identityId
        ? this.userPermissionsService.has('IDENTITY_DOCUMENT_EDIT')
        : this.userPermissionsService.has('IDENTITY_DOCUMENT_ADD'),
      this.identityId ? this.identityService.fetch(this.personId, this.identityId) : of(null)
    )
    .pipe(first())
    .subscribe(([ options, canEdit, identity ]) => {
      this.controls = ([
          { label: label('docTypeCode'), controlName: 'docTypeCode', type: 'select', options, required: true, },
          { label: label('docNumber'), controlName: 'docNumber',  type: 'text', required: true, },
          { label: label('issueDate'), controlName: 'issueDate', type: 'datepicker', },
          { label: label('issuePlace'), controlName: 'issuePlace', type: 'text', },
          { label: label('expiryDate'), controlName: 'expiryDate', type: 'datepicker', },
          { label: label('citizenship'), controlName: 'citizenship', type: 'text', },
          { label: label('comment'), controlName: 'comment', type: 'textarea', },
          { label: label('isMain'), controlName: 'isMain', type: 'checkbox', required: true },
        ] as IDynamicFormControl[])
        .map(control => canEdit ? control : { ...control, disabled: true });

      // TODO: fix displaying of selected identity
      this.identity = identity;
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onConfirm(): void {
    this.onSubmit(this.form.serializedUpdates);
    this.setDialog();
  }

  onCancel(): void {
    this.setDialog();
    const data = { ...this.form.serializedUpdates, isMain: 0 };
    this.onSubmit(data);
  }

  onBeforeSubmit(): void {
    const data = this.form.serializedUpdates;
    if (data.isMain && this.identityService.hasMain) {
      this.setDialog('confirmIdentity');
    } else {
      this.onSubmit(data);
    }
  }

  onBack(): void {
    this.routingService.navigate([ `/workplaces/debtor-card/${this.route.snapshot.paramMap.get('debtId')}` ], this.route);
  }

  private onSubmit(data: any): void {
    const action = this.identityId
      ? this.identityService.update(this.personId, this.identityId, data)
      : this.identityService.create(this.personId, data);

    action.subscribe(() => {
      this.identityService.dispatchAction(IdentityService.DEBTOR_IDENTITY_SAVED);
      this.onBack();
    });
  }
}

import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';

import { IdentityService } from '@app/routes/workplaces/core/identity/identity.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const label = makeKey('debtor.identityDocs.grid');

@Component({
  selector: 'app-identity-card',
  templateUrl: './identity-card.component.html'
})
export class IdentityCardComponent extends DialogFunctions implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  controls: IDynamicFormControl[] = null;
  dialog: string;
  identity: IIdentityDoc;

  private routeParamMap = this.route.snapshot.paramMap;
  private routeData = this.route.snapshot.data;

  private entityKey = this.routeData.entityKey || 'entityId';
  private parentUrl = this.routeData.parentUrl;

  private identityId = Number(this.routeParamMap.get('identityId'));
  private entityId = Number(this.routeParamMap.get(this.entityKey));

  constructor(
    private cdRef: ChangeDetectorRef,
    private identityService: IdentityService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
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
      this.identityId ? this.identityService.fetch(this.entityId, this.identityId) : of(null)
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
          { label: label('isMain'), controlName: 'isMain', type: 'checkbox' },
        ] as IDynamicFormControl[])
        .map(control => canEdit ? control : { ...control, disabled: true });
      this.identity = identity;
      this.cdRef.markForCheck();
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
    if (this.parentUrl) {
      this.routingService.navigateToUrl(this.parentUrl);
    } else {
      this.routingService.navigateToParent(this.route);
    }
  }

  private onSubmit(data: any): void {
    const action = this.identityId
      ? this.identityService.update(this.entityId, this.identityId, data)
      : this.identityService.create(this.entityId, data);

    action.subscribe(() => {
      this.identityService.dispatchAction(IdentityService.DEBTOR_IDENTITY_SAVED);
      this.onBack();
    });
  }
}

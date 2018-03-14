import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, first } from 'rxjs/operators';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { CallService } from '@app/core/calls/call.service';
import { PersistenceService } from '@app/core/persistence/persistence.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account-menu',
  styleUrls: [ './account-menu.component.scss' ],
  templateUrl: './account-menu.component.html'
})
export class AccountMenuComponent extends DialogFunctions implements OnInit {
  @Output() close = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { type: 'text', controlName: 'intPhone', label: 'header.account.dialogs.phoneExtension.intPhone', required: true },
  ];

  dialog: 'ext';

  constructor(
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private callService: CallService,
    private persistenceService: PersistenceService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.callService.usePBX$
      .filter(Boolean)
      .flatMap(() => this.canEditPhoneExtension$)
      .filter(Boolean)
      .flatMap(() => this.callService.params$)
      .pipe(first())
      .filter(params => !params || params.intPhone === null)
      .subscribe(() => {
        this.setDialog('ext');
        this.cdRef.markForCheck();
      });
  }

  get canEditPhoneExtension$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PARAM_AFTER_LOGIN_EDIT'),
      this.callService.settings$.pipe(
        map(settings => settings && settings.useIntPhone === 1),
      ),
    ]);
  }

  get canSubmitPhoneExtension(): boolean {
    return this.form && this.form.canSubmit;
  }

  showPhoneExtensionDialog(event: UIEvent): void {
    this.onClick(event);
    this.setDialog('ext');
  }

  onPhoneExtensionSubmit(): void {
    this.callService.updatePBXParams(this.form.serializedValue);
    this.setDialog(null);
  }

  onCloseDialog(): void {
    this.callService.changePBXParams({ intPhone: '' });
    this.setDialog(null);
  }

  resetSettings(event: UIEvent): void {
    this.onClick(event);
    this.persistenceService.clear();
  }

  logout(event: UIEvent): void {
    this.onClick(event);
    this.authService.dispatchLogoutAction();
  }

  private onClick(event: UIEvent): void {
    event.preventDefault();
    this.close.emit();
  }
}

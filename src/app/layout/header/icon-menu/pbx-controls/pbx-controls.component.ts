import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CallService } from '@app/core/calls/call.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '@app/core/utils';
import { DialogFunctions } from '@app/core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pbx-controls',
  templateUrl: './pbx-controls.component.html',
  styleUrls: [ './pbx-controls.component.scss' ]
})
export class PbxControlsComponent extends DialogFunctions {

  dialog: string;

  constructor(
    private callService: CallService,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  get canDropCall$(): Observable<boolean> {
    return this.callService.canDropCall$;
  }

  get canHoldCall$(): Observable<boolean> {
    return this.callService.canHoldCall$;
  }

  get canRetrieveCall$(): Observable<boolean> {
    return this.callService.canRetrieveCall$;
  }

  get canTransferCall$(): Observable<boolean> {
    return this.callService.canTransferCall$;
  }

  get hasActiveCall$(): Observable<boolean> {
    return this.callService.activeCall$.map(Boolean);
  }

  get showDropCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useDropCall)
    ]);
  }

  get showHoldCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useHoldCall)
    ]);
  }

  get showRetrieveCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useRetrieveCall)
    ]);
  }

  get showTransferCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useTransferCall)
    ]);
  }

  get activeCallNumber$(): Observable<string> {
    return this.callService.activeCall$.map(call => call.phone);
  }

  get activeCallPersonName$(): Observable<string> {
    return this.callService.activeCall$.map(call => `${call.lastName} ${call.firstName} ${call.middleName[0]}.`);
  }

  onDropCall(): void {
    this.callService.dropCall();
  }

  onHoldCall(): void {
    this.callService.holdCall();
  }

  onRetrieveCall(): void {
    this.callService.retrieveCall();
  }

  onTransferCall(): void {
    this.setDialog('operator');
  }

  onPhoneOperatorSelect(operatorId: number): void {
    this.callService.transferCall(operatorId);
  }
}

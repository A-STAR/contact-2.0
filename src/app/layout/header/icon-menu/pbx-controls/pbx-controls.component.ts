import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ICall } from '@app/core/calls/call.interface';

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
export class PbxControlsComponent extends DialogFunctions implements OnInit, OnDestroy {

  dialog: string;

  private activeCall: ICall;
  private activeCallSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private callService: CallService,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activeCallSub = this.callService.activeCall$
      .subscribe(call => {
        this.activeCall = call;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.activeCallSub.unsubscribe();
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

  get activeCallNumber(): string {
    return this.activeCall ? this.activeCall.phone : '';
  }

  get activeCallPersonName(): string {
    return this.activeCall
      ? this.activeCall.lastName || '' +
        this.activeCall.firstName || '' +
        (this.activeCall.middleName ? this.activeCall.middleName[0] + '.' : '')
      : '';
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

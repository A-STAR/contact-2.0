import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IOption } from '@app/core/converter/value-converter.interface';

import { CallService } from '@app/core/calls/call.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pbx-status-dropdown',
  templateUrl: './pbx-status.component.html',
  styleUrls: [ './pbx-status.component.scss' ]
})
export class PbxStatusComponent implements OnInit, OnDestroy {

  private activeStatusCode: number;
  private statusOptions: IOption[] = [];
  private statusSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private callService: CallService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) { }

  ngOnInit(): void {
    this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_AGENT_STATUS)
      .pipe(first())
      .map(statusOptions => statusOptions.filter(status => status.value > 0))
      // // TODO(i.kibisov): remove mock
      .map(() => ([
        { label: 'Постобработка', value: -1 },
        { label: 'Отключен', value: 0 },
        { label: 'Автодайлер', value: 1 },
        { label: 'Исходящие звонки', value: 2 },
        { label: 'Обед', value: 3 }
      ]))
      .subscribe(statusOptions => {
        this.statusOptions = statusOptions;
        this.cdRef.markForCheck();
      });

    this.statusSub = this.callService.pbxStatus$
      .subscribe(statusCode => {
        this.activeStatusCode = statusCode;
        this.cdRef.markForCheck();
      });
  }

  get activeStatusOption(): IOption {
    return Number.isInteger(this.activeStatusCode)
      ? this.statusOptions.find(option => option.value === this.activeStatusCode)
      : this.statusOptions[0];
  }

  get availableStatusOptions(): IOption[] {
    return this.statusOptions.filter(option => option.value > 0);
  }

  get canChangeStatus$(): Observable<boolean> {
    return this.userPermissionsService.has('PBX_CURRENT_USER_AGENT_STATUS_EDIT')
      // TODO (i.kibisov): remove mock
      .map(() => true);
  }

  ngOnDestroy(): void {
    this.statusSub.unsubscribe();
  }

  onChangeStatus(option: IOption): void {
    this.callService.changeBPXStatus(Number(option.value));
  }
}

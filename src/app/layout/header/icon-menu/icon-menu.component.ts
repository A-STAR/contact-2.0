import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';

import { CallService } from '@app/core/calls/call.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-icon-menu',
  styleUrls: [ './icon-menu.component.scss' ],
  templateUrl: './icon-menu.component.html',
})
export class IconMenuComponent {
  private _isSearchVisible = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private callService: CallService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
    private translateService: TranslateService,
  ) {}

  get isSearchVisible(): boolean {
    return this._isSearchVisible;
  }

  get hasNotifications$(): Observable<boolean> {
    return this.notificationsService.count.pipe(map(Boolean));
  }

  get notificationsCount$(): Observable<number> {
    return this.notificationsService.count;
  }

  get showPbxStatus$(): Observable<boolean> {
    return this.callService.pbxStatus$.map(Boolean);
  }

  get showPbxControls$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && {
          useDropCall: settings.useDropCall,
          useHoldCall: settings.useHoldCall,
          useRetrieveCall: settings.useRetrieveCall,
          useTransferCall: settings.useTransferCall
        })
        .map(settings => settings && !!Object.keys(settings).find(key => !!settings[key]))
    ]);
  }

  openNavSearch(): void {
    this._isSearchVisible = true;
    this.cdRef.markForCheck();
  }

  closeNavSearch(): void {
    this._isSearchVisible = false;
    this.cdRef.markForCheck();
  }

  toggleLanguage(): void {
    // STUB: to test the language switching options, remove for production
    const lang = this.translateService.currentLang === 'ru' ? 'en' : 'ru';
    this.translateService.use(lang).pipe(first()).subscribe();
  }
}

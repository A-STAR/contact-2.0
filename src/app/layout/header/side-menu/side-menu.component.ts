import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';

import { NotificationsService } from '../../../core/notifications/notifications.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-side-menu',
  styleUrls: [ './side-menu.component.scss' ],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  private _isSearchVisible = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
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

  openNavSearch(): void {
    this._isSearchVisible = true;
    this.cdRef.markForCheck();
  }

  closeNavSearch(): void {
    this._isSearchVisible = false;
    this.cdRef.markForCheck();
  }

  toggleLanguage(): void {
    // STUB: to test the language switching options
    const lang = this.translateService.currentLang === 'ru' ? 'en' : 'ru';
    this.translateService.use(lang).pipe(first()).subscribe();
  }
}

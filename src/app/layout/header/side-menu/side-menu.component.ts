import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../core/auth/auth.service';
import { PersistenceService } from '../../../core/persistence/persistence.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { first, map } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-side-menu',
  styleUrls: [ './side-menu.component.scss' ],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  @ViewChild('accountDropdown') accountDropdown: DropdownComponent;

  private _isSearchVisible = false;

  constructor(
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private persistenceService: PersistenceService,
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

  editPhoneExtension(): void {
    console.log('111');
    this.accountDropdown.close();
  }

  resetSettings(event: UIEvent): void {
    event.preventDefault();
    this.persistenceService.clear();
    this.accountDropdown.close();
  }

  logout(event: UIEvent): void {
    event.preventDefault();
    this.authService.dispatchLogoutAction();
  }
}

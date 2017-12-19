import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IFilters, INotification } from '../../core/notifications/notifications.interface';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { SettingsService } from '../../core/settings/settings.service';
import { PersistenceService } from '../../core/persistence/persistence.service';

import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('accountDropdown') accountDropdown: DropdownComponent;

  isNavSearchVisible = false;
  isLicenseVisible = false;
  filters$: Observable<IFilters>;
  hasNotifications$: Observable<boolean>;
  notificationsCount$: Observable<number>;
  notifications$: Observable<Array<INotification>>;

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private settings: SettingsService,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
  ) {
    this.filters$ = this.notificationsService.filters;
    this.hasNotifications$ = this.notificationsService.count.map(count => count > 0);
    this.notificationsCount$ = this.notificationsService.count;
  }

  toggleUserSettings(event: MouseEvent): void {
    event.preventDefault();
  }

  openNavSearch(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isNavSearchVisible = true;
  }

  closeNavSearch(): void {
    this.isNavSearchVisible = false;
  }

  get navSearchVisible(): boolean {
    return this.isNavSearchVisible;
  }

  toggleCollapsedSidebar(): void {
    this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
    this.persistenceService.set(PersistenceService.LAYOUT_KEY, this.settings.layout);
  }

  toggleMenu(): void {
    this.settings.layout.menuToggled = !this.settings.layout.menuToggled;
    this.persistenceService.set(PersistenceService.LAYOUT_KEY, this.settings.layout);
  }

  isCollapsedText(): void {
    return this.settings.layout.isCollapsedText;
  }

  showLicenseInfo(): void {
    this.isLicenseVisible = true;
  }

  closeLicenseInfo(): void {
    this.isLicenseVisible = false;
  }

  toggleLanguage(): void {
    // STUB: to test the language switching options
    const lang = this.translateService.currentLang;
    const nextLang = lang === 'ru' ? 'en' : 'ru';
    this.translateService.use(nextLang).pipe(first()).subscribe();
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

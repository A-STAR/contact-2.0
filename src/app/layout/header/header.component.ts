import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsDropdownDirective } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';

import { IFilters, INotification } from '../../core/notifications/notifications.interface';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { SettingsService } from '../../core/settings/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild(BsDropdownDirective) notificationsDropdown: BsDropdownDirective;

  isNavSearchVisible: boolean;

  isLicenseVisible = false;

  filters$: Observable<IFilters>;
  notificationsCount$: Observable<number>;
  notifications$: Observable<Array<INotification>>;

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    public settings: SettingsService,
    private translateService: TranslateService,
  ) {
    this.filters$ = this.notificationsService.filters;
    this.notificationsCount$ = this.notificationsService.length;
    this.notifications$ = this.notificationsService.notifications;
  }

  ngOnInit(): void {
    this.isNavSearchVisible = false;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  toggleUserSettings(event: UIEvent): void {
    event.preventDefault();
  }

  openNavSearch(event: UIEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.setNavSearchVisible(true);
  }

  setNavSearchVisible(stat: boolean): void {
    this.isNavSearchVisible = stat;
  }

  getNavSearchVisible(): boolean {
    return this.isNavSearchVisible;
  }

  toggleOffsidebar(): void {
    this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
  }

  toggleCollapsedSidebar(): void {
    this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
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
    this.translateService.use(nextLang).take(1).subscribe();
  }

  logout(event: UIEvent): void {
    event.preventDefault();
    this.authService.logout().take(1).subscribe();
  }

  onNotificationsClose(): void {
    this.notificationsDropdown.hide();
  }
}

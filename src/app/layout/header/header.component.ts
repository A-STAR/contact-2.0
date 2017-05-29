import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
const browser = require('jquery.browser');

import { INotification } from '../../core/notifications/notifications.interface';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { SettingsService } from '../../core/settings/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // the fullscreen button
  @ViewChild('fsbutton') fsbutton;
  isNavSearchVisible: boolean;

  private notificationsCount = 0;

  private notificationSubscription: Subscription;

  constructor(
    private authService: AuthService,
    public notificationsService: NotificationsService,
    public settings: SettingsService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.isNavSearchVisible = false;
    if (browser.msie) {
        // Not supported under IE
      this.fsbutton.nativeElement.style.display = 'none';
    }

    this.notificationSubscription = this.notificationsService.notifications
      .subscribe((notifications: Array<INotification>) => this.notificationsCount = notifications.length);
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
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

  toggleLanguage(): void {
    // STUB: to test the language switching options
    const lang = this.translateService.currentLang;
    const nextLang = lang === 'ru' ? 'en' : 'ru';
    this.translateService.use(nextLang).subscribe();
  }

  logout(event: UIEvent): void {
    event.preventDefault();
    this.authService.logout().subscribe();
  }
}

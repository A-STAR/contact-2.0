import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { BsDropdownDirective } from 'ngx-bootstrap';

import { IFilters, INotification, INotificationServiceState } from '../../core/notifications/notifications.interface';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { SettingsService } from '../../core/settings/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // TODO: what if there are several dropdowns?
  @ViewChild(BsDropdownDirective) notificationsDropdown: BsDropdownDirective;

  isNavSearchVisible: boolean;

  notifications: Array<INotification> = [];

  filters: IFilters = {};

  private notificationSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    public settings: SettingsService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.isNavSearchVisible = false;

    this.notificationSubscription = this.notificationsService.state
      .subscribe((state: INotificationServiceState) => {
        // NOTE: dirty hack, no other solution for the moment
        setTimeout(() => {
          this.filters = state.filters;
          this.notifications = state.notifications;
        }, 0);
      });
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

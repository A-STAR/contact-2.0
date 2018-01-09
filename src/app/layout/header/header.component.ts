import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/auth/auth.service';
import { PersistenceService } from '../../core/persistence/persistence.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { SettingsService } from '../../core/settings/settings.service';

import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { first } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('accountDropdown') accountDropdown: DropdownComponent;

  isNavSearchVisible = false;
  isLicenseVisible = false;
  notificationsCount: number;
  hasNotifications: boolean;
  notificationsCountSub: Subscription;

  constructor(
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private persistenceService: PersistenceService,
    private settings: SettingsService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.notificationsCountSub = this.notificationsService.count
      .subscribe(count => {
        this.notificationsCount = count;
        this.hasNotifications = count > 0;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.notificationsCountSub.unsubscribe();
  }

  toggleUserSettings(event: MouseEvent): void {
    event.preventDefault();
  }

  openNavSearch(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isNavSearchVisible = true;
    this.cdRef.markForCheck();
  }

  closeNavSearch(): void {
    this.isNavSearchVisible = false;
    this.cdRef.markForCheck();
  }

  getNavSearchVisible(): boolean {
    return this.isNavSearchVisible;
  }

  toggleOffsidebar(): void {
    this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
  }

  isCollapsedText(): void {
    return this.settings.layout.isCollapsedText;
  }

  showLicenseInfo(): void {
    this.isLicenseVisible = true;
    this.cdRef.markForCheck();
  }

  closeLicenseInfo(): void {
    this.isLicenseVisible = false;
    this.cdRef.markForCheck();
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

import { Component, OnInit, ViewChild } from '@angular/core';
// const screenfull = require('screenfull');
const browser = require('jquery.browser');

import { SettingsService } from '../../core/settings/settings.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // the fullscreen button
  @ViewChild('fsbutton') fsbutton;
  isNavSearchVisible: boolean;

  constructor(
    public settings: SettingsService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    this.isNavSearchVisible = false;
    if (browser.msie) {
        // Not supported under IE
      this.fsbutton.nativeElement.style.display = 'none';
    }
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
    // TODO: test the language switching options
  }

  logout(event: UIEvent): void {
    event.preventDefault();
    this.authService.logout().subscribe();
  }
}

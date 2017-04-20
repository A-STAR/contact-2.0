import { Component, HostBinding } from '@angular/core';
import { SettingsService } from './core/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.isCollapsed;
  };

  constructor(public settings: SettingsService) {}
}

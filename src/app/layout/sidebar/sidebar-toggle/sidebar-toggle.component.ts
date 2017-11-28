import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { PersistenceService } from '../../../core/persistence/persistence.service';

@Component({
  selector: 'app-sidebar-toggle',
  templateUrl: './sidebar-toggle.component.html',
  styleUrls: ['./sidebar-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarToggleComponent {

  constructor(private settings: SettingsService,
              private persistenceService: PersistenceService) { }

  toggleCollapsedSidebar(): void {
    this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
    this.persistenceService.set(PersistenceService.LAYOUT_KEY, this.settings.layout);
  }

  toggleAside(): void {
    this.settings.layout.asideToggled = !this.settings.layout.asideToggled;
    this.persistenceService.set(PersistenceService.LAYOUT_KEY, this.settings.layout);
  }

  isCollapsedText(): void {
    return this.settings.layout.isCollapsedText;
  }

  isSidebarCollapsed(): boolean {
    return this.settings.layout.isCollapsed;
  }

}

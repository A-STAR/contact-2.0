import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-message-templates',
  templateUrl: './message-templates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplatesComponent {
  static COMPONENT_NAME = 'MessageTemplatesComponent';

  tabs = [
    { isInitialised: true,  title: 'phoneCall', typeCode: 1 },
    { isInitialised: false, title: 'sms', typeCode: 2 },
    { isInitialised: false, title: 'email', typeCode: 3 },
    { isInitialised: false, title: 'autoComment', typeCode: 4 },
    { isInitialised: false, title: 'custom', typeCode: 5 },
  ].map(tab => ({ ...tab, title: `utilities.messageTemplates.${tab.title}.title` }));

  shouldDisplayTab(tabIndex: number): boolean {
    return this.tabs[tabIndex].isInitialised;
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-message-templates',
  templateUrl: './message-templates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplatesComponent {
  static COMPONENT_NAME = 'MessageTemplatesComponent';

  tabs = [
    { isInitialised: true,  title: 'utilities.messageTemplates.phoneCall.title', typeCode: 1 },
    { isInitialised: false, title: 'utilities.messageTemplates.sms.title', typeCode: 2 },
    { isInitialised: false, title: 'utilities.messageTemplates.email.title', typeCode: 3 },
    { isInitialised: false, title: 'utilities.messageTemplates.autoComment.title', typeCode: 4 },
    { isInitialised: false, title: 'utilities.messageTemplates.custom.title', typeCode: 5 },
  ];

  shouldDisplayTab(tabIndex: number): boolean {
    return this.tabs[tabIndex].isInitialised;
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}

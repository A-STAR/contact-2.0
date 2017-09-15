import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-message-templates',
  templateUrl: './message-templates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplatesComponent {
  static COMPONENT_NAME = 'MessageTemplatesComponent';
}

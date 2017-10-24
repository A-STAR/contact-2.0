import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contact-properties',
  templateUrl: './contact-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertiesComponent {
  static COMPONENT_NAME = 'ContactPropertiesComponent';
}

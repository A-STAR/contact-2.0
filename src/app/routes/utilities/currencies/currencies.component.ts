import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesComponent {
  static COMPONENT_NAME = 'CurrenciesComponent';
}


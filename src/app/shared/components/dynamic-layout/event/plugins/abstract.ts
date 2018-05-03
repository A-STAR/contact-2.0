import { FormGroup } from '@angular/forms';

import { IDynamicLayoutPlugin, IDynamicLayoutEvent } from '../event.interface';

export abstract class AbstractPlugin {
  constructor(
    protected formGroup: FormGroup,
    protected plugin: IDynamicLayoutPlugin,
  ) {}

  abstract handle(event: IDynamicLayoutEvent): void;
}

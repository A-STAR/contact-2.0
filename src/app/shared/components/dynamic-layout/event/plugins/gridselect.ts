import { AbstractPlugin } from './abstract';
import { DynamicLayoutEventType, IDynamicLayoutEvent } from '../event.interface';

export class GridSelectPlugin extends AbstractPlugin {
  handle(event: IDynamicLayoutEvent): void {
    const { from, to, key } = this.plugin;
    if (event.type === DynamicLayoutEventType.GRIDSELECT && event.control.name === from) {
      this.formGroup.patchValue({ [to]: event.row[key] });
    }
  }
}

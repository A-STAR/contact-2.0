import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDisplayProperties } from '../../roles.interface';

@Component({
  selector: 'app-remove-permission',
  templateUrl: './remove.permission.component.html'
})
export class RemovePermissionComponent {

  @Input() displayProperties: IDisplayProperties;
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit(null);
  }

  onDisplayChange(event): void {
    if (event === false) {
      this.displayProperties.removePermit = false;
    }
  }
}

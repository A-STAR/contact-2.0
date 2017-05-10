import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-remove-permission',
  templateUrl: './remove.permission.component.html'
})
export class RemovePermissionComponent {

  @Input() displayProperties;
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit(null);
  }
}

import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-remove-permission',
  templateUrl: './remove.permission.component.html'
})
export class RemovePermissionComponent {

  @Input() display;
  @Output() ok: EventEmitter<void> = new EventEmitter<void>(false);
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  private onRemovePermission() {
    this.ok.emit(null);
  }

  get visibility(): boolean {
    return this.display;
  }

  set visibility(visible: boolean) {
    this.cancel.emit(visible);
  }
}

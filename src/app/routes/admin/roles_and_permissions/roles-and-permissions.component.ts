import { Component, EventEmitter, Output } from '@angular/core';
import { IPermissionRole } from './permissions.interface';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {
  private selectionChange: EventEmitter<IPermissionRole> = new EventEmitter(false);

  onSelect(roleId) {
    this.selectionChange.emit({
      roleId
    });
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { IPermissionsRequest } from './permissions.interface';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {
  @Output() selectionChange: EventEmitter<IPermissionsRequest> = new EventEmitter(false);

  onSelect(roleId) {
    this.selectionChange.emit({
      roleId
    });
  }
}

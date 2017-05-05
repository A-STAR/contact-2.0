import { Component } from '@angular/core';
import { IPermissionRole } from './permissions.interface';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {
  currentRole: IPermissionRole;

  onSelect(id) {
    this.currentRole = {id};
  }
}

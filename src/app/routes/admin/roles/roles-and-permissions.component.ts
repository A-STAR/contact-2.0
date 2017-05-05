import {Component, ViewChild} from '@angular/core';
import {IPermissionRole} from './permissions.interface';
import {RolesComponent} from './roles.component';
import {ToolbarActionTypeEnum} from '../../../shared/components/toolbar/toolbar.interface';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {

  @ViewChild(RolesComponent) rolesComponent: RolesComponent;
  currentRole: IPermissionRole;

  onSelect(id) {
    this.currentRole = {id};
  }

  onRoleClone() {
    this.rolesComponent.callActionByType(ToolbarActionTypeEnum.CLONE);
  }
}

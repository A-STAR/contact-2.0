import { Component, ViewChild } from '@angular/core';
import { RolesComponent } from './roles/roles.component';
import { IRoleRecord } from './roles/roles.interface';
import { ToolbarActionTypeEnum } from '../../../shared/components/toolbar/toolbar.interface';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {

  @ViewChild(RolesComponent) rolesComponent: RolesComponent;
  currentRole: IRoleRecord;

  onSelect(role: IRoleRecord) {
    this.currentRole = role;
  }

  onRoleClone() {
    this.rolesComponent.callActionByType(ToolbarActionTypeEnum.CLONE);
  }
}

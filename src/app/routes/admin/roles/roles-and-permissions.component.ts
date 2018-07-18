import { Component } from '@angular/core';

import { ITab } from '../../../shared/components/layout/tabview/header/header.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  host: { class: 'full-size' },
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {

  constructor(private userPermissionsService: UserPermissionsService) {}

  tabs: ITab[] = [
    {
      link: 'permissions',
      title: 'roles.permissions.tab.title',
      hasPermission: this.userPermissionsService.has('PERMIT_VIEW')
    },
    // {
    //   link: 'access',
    //   title: 'roles.permissions.access.title',
    //   hasPermission: this.userPermissionsService.has('')
    // },
    {
      link: 'objects',
      title: 'roles.permissions.objects.title',
      hasPermission: this.userPermissionsService.has('OBJECT_ROLE_VIEW')
    },
  ];
}

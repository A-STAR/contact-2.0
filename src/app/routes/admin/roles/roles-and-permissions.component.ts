import { Component } from '@angular/core';

import { ITab } from '../../../shared/components/layout/tabview/header/header.interface';

@Component({
  host: { class: 'full-size' },
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {
  tabs: ITab[] = [
    {
      link: 'permissions',
      title: 'roles.permissions.tab.title',
    },
    {
      link: 'access',
      title: 'roles.permissions.access.title',
    },
    {
      link: 'objects',
      title: 'roles.permissions.objects.title',
    },
  ];
}

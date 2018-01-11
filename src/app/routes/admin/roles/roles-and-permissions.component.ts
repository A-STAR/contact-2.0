import { Component } from '@angular/core';

import { ITab } from '../../../shared/components/layout/tabview/header/header.interface';

@Component({
  selector: 'app-roles-and-permissions',
  styles: [ ':host { height: 100% }' ],
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {
  static COMPONENT_NAME = 'RolesAndPermissionsComponent';

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

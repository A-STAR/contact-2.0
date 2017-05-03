import { Component } from '@angular/core';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html'
})
export class RolesAndPermissionsComponent {
  onSelect(id) {
    console.log(`Selected role ${id}`);
  }
}

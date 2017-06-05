import { Component } from '@angular/core';

import { OrganizationsService } from './organizations.service';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html'
})
export class OrganizationsComponent {
  static COMPONENT_NAME = 'OrganizationsComponent';

  constructor(private organizationsService: OrganizationsService) {
    this.organizationsService.state.subscribe(state => console.log(state));
  }
}

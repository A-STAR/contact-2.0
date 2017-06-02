import { Component } from '@angular/core';

import { MasterDetailComponent } from '../../../shared/components/entity/master/entity.master.detail.component';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html'
})

export class OrganizationsComponent extends MasterDetailComponent<any> {
  static COMPONENT_NAME = 'OrganizationsComponent';
}

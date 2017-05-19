import { Component } from '@angular/core';

import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';
import { IEmployee } from '../organizations.interface';

@Component({
  selector: 'app-organizations-employees',
  templateUrl: './organizations-employees.component.html'
})
export class OrganizationsEmployeesComponent extends GridEntityComponent<IEmployee> {
  get info(): string {
    return JSON.stringify(this.masterEntity, null, 2);
  }
}

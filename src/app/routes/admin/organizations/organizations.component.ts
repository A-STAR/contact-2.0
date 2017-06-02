import { Component } from '@angular/core';

import { EmployeesService } from './employees/employees.service';

import { MasterDetailComponent } from '../../../shared/components/entity/master/entity.master.detail.component';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html'
})

export class OrganizationsComponent extends MasterDetailComponent<any> {
  static COMPONENT_NAME = 'OrganizationsComponent';

  constructor(private employeesService: EmployeesService) {
    super();
  }

  load(): void {
    this.employeesService.fetch();
  }
}

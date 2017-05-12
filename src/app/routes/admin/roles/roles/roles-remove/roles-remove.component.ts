import { Component } from '@angular/core';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { IRoleRecord } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-remove',
  templateUrl: './roles-remove.component.html'
})
export class RolesRemoveComponent extends AbstractRolesPopup {
  controls = null;

  constructor(private gridService: GridService) {
    super();
  }

  protected createForm(role: IRoleRecord) {
    return null;
  }

  protected httpAction() {
    return this.gridService.delete('/api/roles/{id}', this.role);
  };
}

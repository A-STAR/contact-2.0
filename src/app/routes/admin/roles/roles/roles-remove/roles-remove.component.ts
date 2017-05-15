import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

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

  /**
   * @override
   */
  protected createForm(role: IRoleRecord): FormGroup {
    return null;
  }

  /**
   * @override
   */
  protected httpAction(): Observable<any> {
    return this.gridService.delete('/api/roles/{id}', this.role);
  };
}

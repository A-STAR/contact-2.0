import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GridService } from '../../../../../shared/components/grid/grid.service';
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

  protected getControls() {
    return [];
  }

  /**
   * @override
   */
  protected httpAction(): Observable<any> {
    return this.gridService.delete('/api/roles/{id}', this.role);
  };
}

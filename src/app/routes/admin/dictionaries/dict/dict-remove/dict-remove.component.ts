import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { AbstractRolesPopup } from '../../../roles/roles/roles-abstract-popup';

@Component({
  selector: 'app-dict-remove',
  templateUrl: './dict-remove.component.html'
})
export class DictRemoveComponent extends AbstractRolesPopup {
  controls = null;

  constructor(private gridService: GridService) {
    super();
  }

  protected getControls(): any {
    return [];
  }

  protected getData(): any {
    return null;
  }

  /**
   * @override
   */
  protected httpAction(): Observable<any> {
    return this.gridService.delete('/api/dict/{id}', this.role);
  };
}

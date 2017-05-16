import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html'
})
export class RolesEditComponent extends AbstractRolesPopup implements OnInit {
  constructor(private gridService: GridService) {
    super();
  }

  get popupTitle(): string {
    return this.isUpdating() ? `Роль: ${this.role.id}` : 'Новая роль';
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'Название',
        controlName: 'name',
        type: 'text',
        required: true,
        value: this.role.name
      },
      {
        label: 'Комментарий',
        controlName: 'comment',
        type: 'textarea',
        rows: 2,
        value: this.role.comment
      }
    ];
  }

  protected httpAction(): Observable<any> {
    return this.isUpdating() ?
      this.httpActionUpdate() :
      this.httpActionCreate();
  }

  private isUpdating(): boolean {
    return !!(this.role && this.role.name);
  }

  private httpActionCreate(): Observable<any> {
    return this.gridService.create('/api/roles', {}, this.formValue);
  }

  private httpActionUpdate(): Observable<any> {
    return this.gridService.update('/api/roles/{id}', this.role, this.formValue);
  }
}

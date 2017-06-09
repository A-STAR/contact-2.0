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
    return this.isUpdating() ? 'roles.roles.edit.title' : 'roles.roles.create.title';
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'roles.roles.edit.name',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'roles.roles.edit.comment',
        controlName: 'comment',
        type: 'textarea',
        rows: 2
      }
    ];
  }

  protected getData(): any {
    return this.role;
  }

  protected httpAction(): Observable<any> {
    return this.isUpdating() ?
      this.update() :
      this.create();
  }

  private isUpdating(): boolean {
    return !!(this.role && this.role.name);
  }

  private create(): Observable<any> {
    return this.gridService.create('/api/roles', {}, this.form.value);
  }

  private update(): Observable<any> {
    return this.gridService.update('/api/roles/{id}', this.role, this.form.value);
  }
}

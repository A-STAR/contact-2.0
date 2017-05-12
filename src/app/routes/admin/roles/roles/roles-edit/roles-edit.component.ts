import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html'
})
export class RolesEditComponent extends AbstractRolesPopup {
  controls: Array<IDynamicFormControl> = [
    {
      label: 'Название',
      controlName: 'name',
      type: 'text',
      required: true
    },
    {
      label: 'Комментарий',
      controlName: 'comment',
      type: 'textarea',
      rows: 2
    },
  ];

  constructor(private formBuilder: FormBuilder, private gridService: GridService) {
    super();
  }

  get popupTitle() {
    return this.isUpdating() ? `Роль: ${this.role.id}` : 'Новая роль';
  }

  protected createForm(role: IRoleRecord) {
    return this.formBuilder.group({
      name: [ this.role.name, Validators.required ],
      comment: [ this.role.comment ],
    });
  }

  protected httpAction(): Observable<any> {
    return this.isUpdating() ?
      this.httpActionUpdate() :
      this.httpActionCreate();
  }

  private isUpdating(): boolean {
    return !!(this.role && this.role.name);
  }

  private httpActionCreate() {
    return this.gridService.create('/api/roles', {}, this.form.getRawValue());
  }

  private httpActionUpdate() {
    return this.gridService.update('/api/roles/{id}', this.role, this.form.getRawValue());
  }
}

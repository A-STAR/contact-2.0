import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
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
      required: true,
      rows: 2
    },
  ];

  constructor(protected authHttp: AuthHttp, private formBuilder: FormBuilder) {
    super();
  }

  get popupTitle() {
    return this.isUpdating() ? `Роль: ${this.role.id}` : 'Новая роль';
  }

  protected createForm(role: IRoleRecord) {
    return this.formBuilder.group({
      name: [ this.role.name, Validators.required ],
      comment: [ this.role.comment, Validators.required ],
    });
  }

  protected httpAction(baseUrl: string) {
    return this.isUpdating() ?
      this.httpActionUpdate(baseUrl) :
      this.httpActionCreate(baseUrl);
  }

  private isUpdating(): boolean {
    return !!(this.role && this.role.name);
  }

  private httpActionCreate(baseUrl: string): Observable<any> {
    return this.authHttp.post(`${baseUrl}/api/roles/`, this.form.getRawValue());
  }

  private httpActionUpdate(baseUrl: string): Observable<any> {
    return this.authHttp.put(`${baseUrl}/api/roles/${this.role.id}`, this.form.getRawValue());
  }
}

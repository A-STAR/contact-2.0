import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../../../core/auth/auth.service';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent extends AbstractRolesPopup implements OnInit {
  @Input() originalRole: IRoleRecord = null;

  controls: Array<IDynamicFormControl>;

  constructor(protected http: AuthHttp, protected authService: AuthService, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.getBaseUrl()
      .subscribe(baseUrl => {
        this.http.get(`${baseUrl}/api/roles`)
          .toPromise()
          .then(data => data.json())
          .then(data => this.initControls(data))
          .catch(error => console.log(error));
      });
  }

  private initControls(data) {
    const options = data.roles.map(role => ({
      label: role.name,
      value: role.id
    }));

    this.controls = [
      {
        label: 'Название оригинальной роли',
        controlName: 'originalRoleId',
        type: 'select',
        options,
        required: true
      },
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
  }

  protected createForm(role: IRoleRecord): FormGroup {
    return this.formBuilder.group({
      originalRoleId: [ this.originalRole.id, Validators.required ],
      name: [ this.role.name, Validators.required ],
      comment: [ this.role.comment, Validators.required ],
    });
  }

  protected httpAction(baseUrl: string): Observable<any> {
    const data = this.form.getRawValue();
    return this.http.post(`${baseUrl}/api/roles/${data.originalRoleId}/copy`, data);
  }
}

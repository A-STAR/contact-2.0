import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../../../../core/auth/auth.service';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent extends AbstractRolesPopup implements OnInit {
  @Input() originalRole: IRoleRecord = null;

  controls: Array<IDynamicFormControl>;

  constructor(protected authHttp: AuthHttp, protected authService: AuthService, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.controls = [
      {
        label: 'Название оригинальной роли',
        controlName: 'originalRoleId',
        type: 'select',
        options: [
          {
            label: this.originalRole.name,
            value: this.originalRole.id
          }
        ],
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

  protected createForm(role: IRoleRecord) {
    return this.formBuilder.group({
      originalRoleId: [ this.originalRole.id, Validators.required ],
      name: [ this.role.name, Validators.required ],
      comment: [ this.role.comment, Validators.required ],
    });
  }

  protected httpAction(baseUrl: string) {
    const data = this.form.getRawValue();
    return this.authHttp.post(`${baseUrl}/api/roles/${data.originalRoleId}/copy`, data);
  }
}

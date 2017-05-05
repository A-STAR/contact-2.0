import { Component } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../../../../core/auth/auth.service';
import { IRoleRecord } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-remove',
  templateUrl: './roles-remove.component.html'
})
export class RolesRemoveComponent extends AbstractRolesPopup {
  controls = null;

  constructor(protected authHttp: AuthHttp, protected authService: AuthService) {
    super();
  }

  protected createForm(role: IRoleRecord) {
    return null;
  }

  protected httpAction(baseUrl: string) {
    return this.authHttp.delete(`${baseUrl}/api/roles/${this.role.id}`);
  };
}

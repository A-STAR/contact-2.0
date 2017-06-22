import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-dict-and-terms',
  templateUrl: './dict-and-terms.component.html',
  styleUrls: ['./dict-and-terms.component.scss'],
})
export class DictAndTermsComponent {
  static COMPONENT_NAME = 'DictAndTermsComponent';

  constructor(private userPermissionsService: UserPermissionsService) {}

  get canDictionariesShow(): Observable<boolean> {
    return this.userPermissionsService.has('DICT_VIEW');
  }
}

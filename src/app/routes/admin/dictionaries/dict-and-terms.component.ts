import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PermissionsService } from '../../../core/permissions/permissions.service';

@Component({
  selector: 'app-dict-and-terms',
  templateUrl: './dict-and-terms.component.html',
  styleUrls: ['./dict-and-terms.component.scss'],
})
export class DictAndTermsComponent {
  static COMPONENT_NAME = 'DictAndTermsComponent';

  constructor(private permissionsService: PermissionsService) {}

  get canDictionariesShow(): Observable<boolean> {
    return this.permissionsService.hasPermission('DICT_VIEW');
  }
}

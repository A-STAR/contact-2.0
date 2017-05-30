import { Component } from '@angular/core';

import { IDict } from './dict/dict.interface';
import { MasterDetailComponent } from '../../../shared/components/entity/master/entity.master.detail.component';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-dict-and-terms',
  templateUrl: './dict-and-terms.component.html',
  styleUrls: ['./dict-and-terms.component.scss'],
})
export class DictAndTermsComponent extends MasterDetailComponent<IDict> {
  static COMPONENT_NAME = 'DictAndTermsComponent';

  constructor(private userPermissionsService: UserPermissionsService) {
    super();
  }

  canDictionariesShow(): boolean {
    return this.userPermissionsService.hasPermission('DICT_VIEW');
  }
}

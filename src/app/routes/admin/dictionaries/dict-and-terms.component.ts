import { Component } from '@angular/core';

import { IDict } from './dict/dict.interface';
import { MasterDetailComponent } from '../../../shared/components/entity/master/entity.master.detail.component';
import { PermissionsService } from '../../../core/permissions/permissions.service';

@Component({
  selector: 'app-dict-and-terms',
  templateUrl: './dict-and-terms.component.html',
  styleUrls: ['./dict-and-terms.component.scss'],
})
export class DictAndTermsComponent extends MasterDetailComponent<IDict> {
  static COMPONENT_NAME = 'DictAndTermsComponent';

  constructor(private permissionsService: PermissionsService) {
    super();
  }

  canDictionariesShow(): boolean {
    return this.permissionsService.hasPermission('DICT_VIEW');
  }
}

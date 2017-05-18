import { Component } from '@angular/core';

import { IDict } from './dict/dict.interface';
import { EntityMasterDetailComponent } from '../../../shared/components/entity/master/entity.master.detail.component';

@Component({
  selector: 'app-dict-and-terms',
  templateUrl: './dict-and-terms.component.html'
})
export class DictAndTermsComponent extends EntityMasterDetailComponent<IDict> {

  constructor() {
    super();
  }
}

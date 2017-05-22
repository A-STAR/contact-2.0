import { Component } from '@angular/core';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOrganization } from '../../organizations.interface';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html'
})
export class OrganizationEditComponent extends EntityBaseComponent<IOrganization> {
  protected getControls(): Array<IDynamicFormControl> {
    return [];
  }
}

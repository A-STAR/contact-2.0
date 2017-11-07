import { ChangeDetectionStrategy, Component } from '@angular/core';

import { INode } from '../../../../shared/gui-objects/container/container.interface';

import {
  PhoneGridComponent as PhoneGridWidgetComponent,
} from '../../../../shared/gui-objects/widgets/phone/grid/phone-grid.component';

@Component({
  selector: 'app-incoming-call-phone-grid',
  templateUrl: 'phone-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridComponent {
  node: INode = {
    component: PhoneGridWidgetComponent,
    inject: {
      personRole: 1,
      contactType: 1,
    }
  };
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { INode } from '../../../../shared/gui-objects/container/container.interface';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

import { AttributeGridComponent } from '../../../../shared/gui-objects/widgets/entity-attribute/grid/attribute-grid.component';

@Component({
  selector: 'app-debtor-attributes',
  templateUrl: './attributes.component.html'
})
export class DebtorAttributesComponent {
  static COMPONENT_NAME = 'DebtorAttributesComponent';
  static ENTITY_TYPE_DEBT = 19;

  node: INode = {
    container: 'flat',
    children: [
      {
        component: AttributeGridComponent,
        inject: {
          entityTypeId$: Observable.of(DebtorAttributesComponent.ENTITY_TYPE_DEBT),
          entityId$: this.debtorCardService.selectedDebtId$,
        }
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private debtorCardService: DebtorCardService,
  ) {}
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAttribute } from '../../../../shared/gui-objects/widgets/entity-attribute/attribute.interface';

@Component({
  selector: 'app-contractors-and-portfolios-version',
  templateUrl: './contractors-and-portfolios-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorsAndPortfoliosVersionComponent implements OnInit {
  static COMPONENT_NAME = 'ContractorsAndPortfoliosVersionComponent';
  selectedAttribute: IAttribute;
  entityId: number;
  entityTypeId: number;

  constructor(private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.selectedAttribute = params.selectedAttribute;
        this.entityId = params.entityId;
        this.entityTypeId = params.entityTypeId;
      });
  }

}

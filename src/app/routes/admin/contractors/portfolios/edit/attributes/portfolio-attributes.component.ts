import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { INode } from '../../../../../../shared/gui-objects/container/container.interface';

import {
  AttributeGridComponent
} from '../../../../../../shared/gui-objects/widgets/entity-attribute/grid/attribute-grid.component';

@Component({
  selector: 'app-portfolio-attributes',
  templateUrl: './portfolio-attributes.component.html',
  styleUrls: ['./portfolio-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioAttributesComponent implements OnInit {

  static COMPONENT_NAME = 'PortfolioAttributesComponent';
  static ENTITY_TYPE_PORTFOLIO = 15;

  node: INode = {
    container: 'flat',
    children: [
      {
        component: AttributeGridComponent,
        inject: {
          entityTypeId$: Observable.of(PortfolioAttributesComponent.ENTITY_TYPE_PORTFOLIO),
          entityId$: Observable.of((<any>this.route.params).value.portfolioId)
        }
      }
    ]
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

  }

  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }


}

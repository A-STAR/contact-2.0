import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { INode } from '../../../../../../shared/gui-objects/container/container.interface';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';

import {
  AttributeGridComponent
} from '../../../../../../shared/gui-objects/widgets/entity-attribute/grid/attribute-grid.component';

@Component({
  selector: 'app-contractor-attributes',
  templateUrl: './contractor-attributes.component.html',
  styleUrls: ['./contractor-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorAttributesComponent implements OnInit {
  static COMPONENT_NAME = 'ContractorAttributesComponent';
  static ENTITY_TYPE_CONTRACTOR = 13;

  node: INode = {
    container: 'flat',
    children: [
      {
        component: AttributeGridComponent,
        inject: {
          entityTypeId$: Observable.of(ContractorAttributesComponent.ENTITY_TYPE_CONTRACTOR),
          entityId$: Observable.of((<any>this.route.params).value.contractorId)
        }
      }
    ]
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contentTabService: ContentTabService) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.contentTabService.gotoParent(this.router, 1);
  }

}

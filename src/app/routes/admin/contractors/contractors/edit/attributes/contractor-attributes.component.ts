import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { INode } from '../../../../../../shared/gui-objects/container/container.interface';

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

  entityTypeId$: Observable<number>;
  entityId$: Observable<number>;

  constructor(
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.entityTypeId$ = Observable.of(ContractorAttributesComponent.ENTITY_TYPE_CONTRACTOR);
    this.entityId$ = this.route.paramMap.map(params => Number(params.get('contractorId')));
  }

  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}

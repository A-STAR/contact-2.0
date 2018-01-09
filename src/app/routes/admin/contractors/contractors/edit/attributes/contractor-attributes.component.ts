import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';

@Component({
  selector: 'app-contractor-attributes',
  templateUrl: './contractor-attributes.component.html',
  styleUrls: ['./contractor-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorAttributesComponent implements OnInit {
  static COMPONENT_NAME = 'ContractorAttributesComponent';
  static ENTITY_TYPE_CONTRACTOR = 13;

  entityTypeId: number;
  entityId$: Observable<number>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contentTabService: ContentTabService) { }

  ngOnInit(): void {
    this.entityTypeId = ContractorAttributesComponent.ENTITY_TYPE_CONTRACTOR;
    this.entityId$ = this.route.paramMap.map(params => Number(params.get('contractorId')));
  }

  onBack(): void {
    this.contentTabService.gotoParent(this.router, 1);
  }

}

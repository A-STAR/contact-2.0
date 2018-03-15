import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-contractor-attributes',
  templateUrl: './contractor-attributes.component.html',
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorAttributesComponent implements OnInit {
  static ENTITY_TYPE_CONTRACTOR = 13;

  entityTypeId: number;
  entityId: number;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService) { }

  ngOnInit(): void {
    this.entityTypeId = ContractorAttributesComponent.ENTITY_TYPE_CONTRACTOR;
    this.entityId = Number(this.route.snapshot.paramMap.get('contractorId'));
  }

  onBack(): void {
    this.routingService.navigate([
      '/admin',
      'contractors',
      String(this.entityId)
    ]);
  }

}

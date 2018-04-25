import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributesComponent implements OnInit {
  static ENTITY_TYPE_CONTRACTOR = 13;

  entityTypeId: number;
  entityId: number;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService) { }

  ngOnInit(): void {
    this.entityTypeId = AttributesComponent.ENTITY_TYPE_CONTRACTOR;
    this.entityId = Number(this.route.snapshot.paramMap.get('contractorId'));
  }

  onBack(): void {
    this.routingService.navigate([ `/app/admin/contractors/${String(this.entityId)}` ]);
  }

}

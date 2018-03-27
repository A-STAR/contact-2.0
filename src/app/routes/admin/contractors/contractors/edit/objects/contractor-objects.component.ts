import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-contractor-objects',
  templateUrl: './contractor-objects.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorObjectsComponent {
  static COMPONENT_NAME = 'ContractorObjectsComponent';

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) { }

  get contractorId(): number {
    return Number(this.route.snapshot.paramMap.get('contractorId'));
  }

  onBack(): void {
    this.routingService.navigate([
      '/admin',
      'contractors',
      String(this.contractorId)
    ]);
  }
}

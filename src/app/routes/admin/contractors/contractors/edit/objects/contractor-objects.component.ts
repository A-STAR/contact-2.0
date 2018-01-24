import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-contractor-attributes',
  templateUrl: './contractor-objects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorObjectsComponent {
  static COMPONENT_NAME = 'ContractorObjectsComponent';

  constructor(
    private routingService: RoutingService,
    private route: ActivatedRoute
  ) { }

  get contractorId(): number {
    return Number(this.route.snapshot.paramMap.get('contractorId'));
  }

  onBack(): void {
    this.routingService.navigate([ `/admin/contractors/${this.contractorId}` ], this.route);
  }
}

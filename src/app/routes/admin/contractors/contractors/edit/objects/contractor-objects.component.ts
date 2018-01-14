import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contractor-attributes',
  templateUrl: './contractor-objects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorObjectsComponent {
  static COMPONENT_NAME = 'ContractorObjectsComponent';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  get contractorId(): number {
    return Number(this.route.snapshot.paramMap.get('contractorId'));
  }

  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

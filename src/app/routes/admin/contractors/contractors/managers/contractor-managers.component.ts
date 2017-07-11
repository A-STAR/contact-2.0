import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';

@Component({
  selector: 'app-contractor-managers',
  templateUrl: './contractor-managers.component.html'
})
export class ContractorManagersComponent {
  static COMPONENT_NAME = 'ContractorManagersComponent';

  private contractorId = Number((this.activatedRoute.params as any).value.id);

  constructor(
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
  ) {}

  onClose(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}`);
  }
}

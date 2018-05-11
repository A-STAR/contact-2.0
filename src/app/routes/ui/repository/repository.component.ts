import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RepositoryService } from '@app/core/repository/repository.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-repository',
  templateUrl: './repository.component.html'
})
export class RepositoryComponent {
  readonly users$ = this.repositoryService.fetch('user', { id: 1 });

  constructor(
    private repositoryService: RepositoryService,
  ) {}
}

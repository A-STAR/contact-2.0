import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RepositoryService } from '@app/core/repository/repository.service';
import { User, Debtor, Debt } from '@app/entities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-repository',
  templateUrl: './repository.component.html'
})
export class RepositoryComponent {
  readonly users$ = this.repositoryService.fetch(User, { id: 1 });
  readonly persons$ = this.repositoryService.fetch(Debtor, { id: 1 });
  readonly debts$ = this.repositoryService.fetch(Debt, { personId: 2 });

  constructor(
    private repositoryService: RepositoryService,
  ) {}
}

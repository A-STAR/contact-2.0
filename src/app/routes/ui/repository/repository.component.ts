import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RepositoryService } from '@app/core/repository/repository.service';

import { User } from './entities/user';
import { Person } from './entities/person';
import { Debt } from './entities/debt';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-repository',
  templateUrl: './repository.component.html'
})
export class RepositoryComponent {
  readonly users$ = this.repositoryService.fetch(User, { id: 1 });
  readonly persons$ = this.repositoryService.fetch(Person, { id: 1 });
  readonly debts$ = this.repositoryService.fetch(Debt, { id: 1 });

  constructor(
    private repositoryService: RepositoryService,
  ) {}
}

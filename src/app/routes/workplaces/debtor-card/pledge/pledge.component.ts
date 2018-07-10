import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-pledge',
  templateUrl: './pledge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PledgeComponent {
  constructor(
    private userPermissionsService: UserPermissionsService,
  ) { }

  readonly displayAttributes$ = this.userPermissionsService.contains('ATTRIBUTE_VIEW_LIST', 32);
}

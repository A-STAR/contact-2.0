import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyComponent {
  @Input() personId: number;
  constructor(
    private userPermissionsService: UserPermissionsService,
  ) { }

  readonly displayAttributes$ = this.userPermissionsService.contains('ATTRIBUTE_VIEW_LIST', 33);

}

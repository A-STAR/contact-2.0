import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { AuthService } from '@app/core/auth/auth.service';
import { PersistenceService } from '@app/core/persistence/persistence.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account-menu',
  styleUrls: [ './account-menu.component.scss' ],
  templateUrl: './account-menu.component.html'
})
export class AccountMenuComponent {
  @Output() close = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private persistenceService: PersistenceService,
  ) {}

  editPhoneExtension(event: UIEvent): void {
    this.onClick(event);
    console.log('111');
  }

  resetSettings(event: UIEvent): void {
    this.onClick(event);
    this.persistenceService.clear();
  }

  logout(event: UIEvent): void {
    this.onClick(event);
    this.authService.dispatchLogoutAction();
  }

  private onClick(event: UIEvent): void {
    event.preventDefault();
    this.close.emit();
  }
}

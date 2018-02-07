import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { AuthService } from '@app/core/auth/auth.service';
import { PersistenceService } from '@app/core/persistence/persistence.service';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account-menu',
  styleUrls: [ './account-menu.component.scss' ],
  templateUrl: './account-menu.component.html'
})
export class AccountMenuComponent extends DialogFunctions {
  @Output() close = new EventEmitter<void>();

  dialog: 'ext';

  constructor(
    private authService: AuthService,
    private persistenceService: PersistenceService,
  ) {
    super();
  }

  showPhoneExtensionDialog(event: UIEvent): void {
    this.onClick(event);
    this.setDialog('ext');
  }

  onPhoneExtensionSubmit(): void {
    console.log('Submitting phone extension...');
    this.setDialog(null);
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

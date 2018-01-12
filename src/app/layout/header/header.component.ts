import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/auth/auth.service';
import { PersistenceService } from '../../core/persistence/persistence.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { SettingsService } from '../../core/settings/settings.service';

import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { first } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private _isLicenseVisible = false;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get isLicenseVisible(): boolean {
    return this._isLicenseVisible;
  }

  showLicenseInfo(): void {
    this._isLicenseVisible = true;
    this.cdRef.markForCheck();
  }

  closeLicenseInfo(): void {
    this._isLicenseVisible = false;
    this.cdRef.markForCheck();
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
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

import { Component, HostListener } from '@angular/core';
import { LayoutService } from '@app/layout/layout.service';

@Component({
  host: { class: 'full-height' },
  selector: 'app-layout',
  styleUrls: [ './layout.component.scss' ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {

  constructor(private layoutService: LayoutService) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    this.layoutService.triggerDimensionChange();
  }
}

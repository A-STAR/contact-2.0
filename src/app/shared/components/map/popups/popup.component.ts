import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent<T> {
  @Input() data: T;
}

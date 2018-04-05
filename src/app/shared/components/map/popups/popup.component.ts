import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent<T> {
  @Input() data: T;
}

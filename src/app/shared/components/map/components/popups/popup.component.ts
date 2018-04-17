import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent<T> {
  @Input() context: any;
  @Input() tpl: TemplateRef<T>;
}

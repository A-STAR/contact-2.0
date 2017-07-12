import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input() title: string;
  @Input() active = false;
  @Input() closable = true;
  @Output() onClose = new EventEmitter<number>();

  constructor() {}
}

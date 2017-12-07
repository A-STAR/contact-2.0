import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabview-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabViewTabComponent {
  @Input() title: string;
  @Input() active = false;
  @Input() closable = true;
  @Input() disabled = false;

  @Output() onClose = new EventEmitter<number>();
}

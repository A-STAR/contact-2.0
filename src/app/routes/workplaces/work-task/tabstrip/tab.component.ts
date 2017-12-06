import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sleek-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class SleekTabComponent {
  @Input() title: string;
  @Input() active = false;
  @Input() closable = true;
  @Input() disabled = false;

  @Output() onClose = new EventEmitter<number>();
}

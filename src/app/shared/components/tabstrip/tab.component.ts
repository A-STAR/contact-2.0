import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab',
  styles: [`
    .pane{
      padding: 0;
    }
  `],
  template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
  @Input() title: string;
  @Input() active = false;
  @Output() onClose = new EventEmitter<number>();

  constructor() {

  }
}

import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-tabview-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabViewTabComponent implements OnChanges {
  @Input() title: string;
  @Input() active = false;
  @Input() closable = false;
  @Input() disabled = false;

  @Input() visible = true;

  @Output() onClose = new EventEmitter<number>();

  readonly visible$ = new BehaviorSubject<boolean>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && (!changes.visible.isFirstChange() || changes.visible.currentValue)) {
      this.visible$.next(changes.visible.currentValue);
    }
  }
}

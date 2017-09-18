import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent<T> {
  @Input() items: T[];
  @Input() getName: (item: T) => string = () => null;

  @Output() doubleClick = new EventEmitter<T>();

  onDblClick(item: T): void {
    this.doubleClick.emit(item);
  }
}

import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-tabview-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabViewTabComponent {
  @Input() title: string;
  @Input() active = false;
  @Input() closable = false;
  @Input() disabled = false;

  @Input() set visible(value: boolean) {
    this.visible$.next(value === null ? true : value);
    this.cdRef.markForCheck();
  }

  @Output() onClose = new EventEmitter<number>();

  readonly visible$ = new BehaviorSubject<boolean>(null);

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  get visible(): boolean {
    return this.visible$.value;
  }
}
